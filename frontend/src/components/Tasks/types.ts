import { UniqueIdentifier } from '@dnd-kit/core';

export type Task = {
  id: UniqueIdentifier;
  title: string;
  description: string;
  color?: string;
  columnId: UniqueIdentifier;
  moduleTitle?: string;
  orderIndex?: number;
};

export type Column = {
  id: UniqueIdentifier;
  title: string;
  tasks: Task[];
};
