import { Column, Task } from '../components/Tasks/types';

export function initializeColumns(columns: Column[], tasks: Task[]): Column[] {
  return columns.map((col) => ({
    ...col,
    tasks: tasks.filter((task) => task.columnId === col.id),
  }));
}
