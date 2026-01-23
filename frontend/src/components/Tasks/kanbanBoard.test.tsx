import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { KanbanBoard } from './kanbanBoard';
import { Column } from './types';


// Mock data
const mockColumns: Column[] = [
  {
    id: 'to-do',
    title: 'To Do',
    tasks: [
      { id: 'task-1', title: 'Task 1', description: 'Description 1', columnId: 'to-do' },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [],
  },
];

const mockSetColumns = vi.fn(() => console.log('mockSetColumns called!'));

describe('KanbanBoard Drag and Drop', () => {
  it('should render the Kanban board correctly', () => {
    const { getByText } = render(
      <KanbanBoard
        columns={mockColumns}
        setColumns={mockSetColumns}
        onEditTask={vi.fn()}
        onDeleteTask={vi.fn()}
        userId="test-user"
      />
    );

    // Assert that columns and tasks are rendered
    expect(getByText('To Do')).toBeInTheDocument();
    expect(getByText('In Progress')).toBeInTheDocument();
    expect(getByText('Task 1')).toBeInTheDocument();
  });
});
