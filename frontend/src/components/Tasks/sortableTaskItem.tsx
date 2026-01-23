'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskItem } from './taskItem';
import { Task } from './types';

type SortableTaskItemProps = {
  task: Task;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string, taskTitle: string) => void; // geänderte Signatur
};

export const SortableTaskItem: React.FC<SortableTaskItemProps> = ({
  task,
  onEdit,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskItem
        title={task.title}
        description={task.description}
        color={task.color}
        onEdit={() => onEdit(String(task.id))}
        onDelete={() => onDelete(String(task.id), task.title)}
        showEditButton={true}
        showDeleteButton={true}
      />
    </div>
  );
};
