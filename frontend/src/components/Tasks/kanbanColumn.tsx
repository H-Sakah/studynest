import React from 'react';
import { Column } from './types';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableTaskItem } from './sortableTaskItem';
import { useDroppable } from '@dnd-kit/core';

type KanbanColumnProps = {
  column: Column;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string, taskTitle: string) => void;
};

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  onEditTask,
  onDeleteTask,
}) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className="p-4 bg-gray-100 rounded shadow-md w-80 flex-shrink-0 min-h-[200px]"
    >
      <h2 className="text-lg font-bold mb-4">{column.title}</h2>
      <SortableContext
        items={column.tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        {column.tasks.map((task) => (
          <SortableTaskItem
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
      </SortableContext>
    </div>
  );
};
