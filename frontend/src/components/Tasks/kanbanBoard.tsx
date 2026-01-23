import React, { useState } from 'react';
import { Column, Task } from './types';
import { KanbanColumn } from './kanbanColumn';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  findColumnByTaskId,
  reorderTasksWithinColumn,
  moveTaskBetweenColumns,
} from '../../utils/kanbanHelpers';
import { TaskItem } from './taskItem';
import {
  updateTaskColumn,
  reorderTasksInFirestore,
} from '../../firebase/firebaseTasksService';

type KanbanBoardProps = {
  columns: Column[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string, taskTitle: string) => void;
  userId: string | null;
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  setColumns,
  onEditTask,
  onDeleteTask,
  userId,
}) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // PointerSensor für Drag & Drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Helper: Validierung von Drag Event Objekten mit genau typisierten Parametern
  const validateDragEvent = (
    active: { id: UniqueIdentifier },
    over: { id: UniqueIdentifier } | null,
    activeTask: Task | null
  ): boolean => {
    return over !== null && activeTask !== null;
  };

  // Helper: Entferne den Task aus seiner Quellspalte
  const removeTaskFromColumn = (
    columns: Column[],
    taskId: UniqueIdentifier,
    fromColumnId: UniqueIdentifier
  ): Column[] => {
    return columns.map((col) => {
      if (col.id === fromColumnId) {
        const newTasks = [...col.tasks];
        const removeIndex = newTasks.findIndex((task) => task.id === taskId);
        if (removeIndex !== -1) newTasks.splice(removeIndex, 1);
        return { ...col, tasks: newTasks };
      }
      return col;
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { column, index } = findColumnByTaskId(columns, active.id);
    if (column && index !== -1) {
      setActiveTask(column.tasks[index]);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (!validateDragEvent(active, over, activeTask)) return;

    const activeId = active.id;
    const overId = over.id;
    const { column: fromColumn } = findColumnByTaskId(columns, activeId);
    if (!fromColumn) return;

    const isOverColumn = columns.some((col) => col.id === overId);
    const { column: toColumn } = findColumnByTaskId(columns, overId);

    setColumns((prevColumns) => {
      let newColumns = removeTaskFromColumn(
        prevColumns,
        activeTask!.id,
        fromColumn.id
      );
      // Füge den Task in die Zielspalte ein
      if (isOverColumn) {
        const targetColumn = newColumns.find((col) => col.id === overId);
        if (targetColumn) {
          const newTasks = [...targetColumn.tasks, activeTask!];
          newColumns = newColumns.map((col) =>
            col.id === targetColumn.id ? { ...col, tasks: newTasks } : col
          );
        }
      } else if (toColumn) {
        const targetIndex = toColumn.tasks.findIndex(
          (task) => task.id === overId
        );
        if (targetIndex !== -1) {
          newColumns = newColumns.map((col) => {
            if (col.id === toColumn.id) {
              const newTasks = [...col.tasks];
              newTasks.splice(targetIndex, 0, activeTask!);
              return { ...col, tasks: newTasks };
            }
            return col;
          });
        }
      }
      return newColumns;
    });
  };

  // hier sollte die Spalte als auch die Reihenfolge in der Db aktualisiert werden
  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);

    const { active, over } = event;
    if (!over || !active || !userId) return;

    const activeId = active.id;
    const overId = over.id;

    const { column: fromColumn, index: fromIndex } = findColumnByTaskId(
      columns,
      activeId
    );
    if (!fromColumn) return;

    const isOverColumn = columns.some((col) => col.id === overId);

    let newColumnsState = columns;

    if (isOverColumn) {
      // 1) Task wird auf eine leere Spalte gezogen
      const toColumn = columns.find((col) => col.id === overId);
      if (!toColumn || fromColumn.id === toColumn.id) {
        return;
      }

      // Firestore: Spalte updaten
      try {
        await updateTaskColumn(userId, String(activeId), String(toColumn.id));
      } catch (error) {
        console.error('Fehler beim Aktualisieren der Task-Spalte:', error);
      }

      // Lokal verschieben
      newColumnsState = moveTaskBetweenColumns(
        columns,
        String(fromColumn.id),
        fromIndex,
        String(toColumn.id),
        toColumn.tasks.length // ans Ende
      );
      setColumns(newColumnsState);

      // Anschließend die orderIndexes in Firestore fixen:
      await updateOrderIndexesInFirestore(
        newColumnsState,
        userId,
        String(fromColumn.id),
        String(toColumn.id)
      );
    } else {
      // 2) Task wird auf einen anderen Task gezogen
      const { column: toColumn } = findColumnByTaskId(columns, overId);
      if (!toColumn) return;

      const toIndex = toColumn.tasks.findIndex((t) => t.id === overId);

      if (fromColumn.id === toColumn.id) {
        // Neu anordnen innerhalb derselben Spalte
        newColumnsState = reorderTasksWithinColumn(
          columns,
          String(fromColumn.id),
          fromIndex,
          toIndex
        );
        setColumns(newColumnsState);

        // Nun neue Reihenfolge in Firestore speichern
        await updateOrderIndexesInFirestore(
          newColumnsState,
          userId,
          String(fromColumn.id)
        );
      } else {
        // Verschieben in eine andere Spalte, aber über einen Task
        try {
          await updateTaskColumn(userId, String(activeId), String(toColumn.id));
        } catch (error) {
          console.error('Fehler beim Aktualisieren der Task-Spalte:', error);
        }

        newColumnsState = moveTaskBetweenColumns(
          columns,
          String(fromColumn.id),
          fromIndex,
          String(toColumn.id),
          toIndex
        );
        setColumns(newColumnsState);

        // Neue Reihenfolge in Firestore schreiben
        await updateOrderIndexesInFirestore(
          newColumnsState,
          userId,
          String(fromColumn.id),
          String(toColumn.id)
        );
      }
    }
  };

  // Hilfsfunktion um die Spalten aller Tasks zu aktualisieren
  const updateOrderIndexesInFirestore = async (
    columnsState: Column[],
    userId: string,
    ...columnIds: string[]
  ) => {
    for (const colId of columnIds) {
      const col = columnsState.find((c) => c.id === colId);
      if (!col) continue;

      // Tasks sortiert
      const sortedTasks = [...col.tasks].sort(
        (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)
      );

      const tasksForFirestore = sortedTasks.map((task, index) => ({
        id: String(task.id),
        columnId: colId,
        orderIndex: index,
      }));

      // Batch-Update in Firestore
      try {
        await reorderTasksInFirestore(userId, tasksForFirestore);
      } catch (error) {
        console.error('Fehler beim Reorder in Firestore:', error);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-auto p-4">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="w-80">
            <TaskItem
              title={activeTask.title}
              description={activeTask.description}
              color={activeTask.color}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};
