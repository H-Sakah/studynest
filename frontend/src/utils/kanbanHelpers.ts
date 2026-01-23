import { UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Column, Task } from '../components/Tasks/types';

export function findColumnByTaskId(
  columns: Column[],
  taskId: UniqueIdentifier
) {
  for (let col of columns) {
    const index = col.tasks.findIndex((task) => task.id === taskId);
    if (index !== -1) {
      return { column: col, index };
    }
  }
  return { column: null, index: -1 };
}

export function reorderTasksWithinColumn(
  columns: Column[],
  fromColumnId: UniqueIdentifier,
  fromIndex: number,
  toIndex: number
): Column[] {
  return columns.map((col) => {
    if (col.id === fromColumnId) {
      const newTasks = arrayMove(col.tasks, fromIndex, toIndex);
      return { ...col, tasks: newTasks };
    }
    return col;
  });
}

export function moveTaskBetweenColumns(
  columns: Column[],
  fromColumnId: UniqueIdentifier,
  fromIndex: number,
  toColumnId: UniqueIdentifier,
  toIndex: number
): Column[] {
  const fromColumn = columns.find((col) => col.id === fromColumnId);
  const toColumn = columns.find((col) => col.id === toColumnId);

  if (!fromColumn || !toColumn) return columns;

  const fromTask = fromColumn.tasks[fromIndex];

  return columns.map((col) => {
    if (col.id === fromColumnId) {
      const newTasks = [...col.tasks];
      newTasks.splice(fromIndex, 1);
      return { ...col, tasks: newTasks };
    }

    if (col.id === toColumnId) {
      const newTasks = [...col.tasks];
      newTasks.splice(toIndex, 0, { ...fromTask, columnId: toColumnId });
      return { ...col, tasks: newTasks };
    }

    return col;
  });
}

export function previewTaskPositionOnDragOver(
  columns: Column[],
  activeTask: Task,
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier
): Column[] {
  let newColumns = columns;

  const { column: fromColumn } = findColumnByTaskId(newColumns, activeId);
  if (fromColumn) {
    newColumns = newColumns.map((col) => {
      if (col.id === fromColumn.id) {
        const newTasks = [...col.tasks].filter(
          (task) => task.id !== activeTask.id
        );
        return { ...col, tasks: newTasks };
      }
      return col;
    });
  }

  const isOverColumn = newColumns.some((col) => col.id === overId);
  if (isOverColumn) {
    newColumns = newColumns.map((col) => {
      if (col.id === overId) {
        const newTasks = [...col.tasks, activeTask];
        return { ...col, tasks: newTasks };
      }
      return col;
    });
  } else {
    const { column: toColumn } = findColumnByTaskId(newColumns, overId);
    if (toColumn) {
      const targetIndex = toColumn.tasks.findIndex(
        (task) => task.id === overId
      );
      if (targetIndex !== -1) {
        newColumns = newColumns.map((col) => {
          if (col.id === toColumn.id) {
            const newTasks = [...col.tasks];
            newTasks.splice(targetIndex, 0, activeTask);
            return { ...col, tasks: newTasks };
          }
          return col;
        });
      }
    }
  }

  return newColumns;
}
