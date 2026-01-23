import { TaskItem, TaskItemProps as taskItemProps } from '../Tasks/taskItem';

export type taskListProps = {
  tasks: taskItemProps[];
};

export const TaskList = ({ tasks }: taskListProps) => {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-4">Aufgaben:</h2>
      <div>
        {tasks.map((task, index) => (
          <TaskItem
            key={index}
            title={task.title}
            description={task.description}
            color={task.color}
          />
        ))}
      </div>
    </div>
  );
};
