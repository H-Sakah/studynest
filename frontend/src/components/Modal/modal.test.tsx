import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NameProvider } from '../User/nameContext';
import { Header } from '../Header/header';
import { Modal } from '../Modal/modal';

describe('Header Component with Modal', () => {
  it('renders the modal when the button is clicked', () => {
    const mockOnClick = vi.fn(); // Mock function for the click handler

    // Render the Header component
    render(
      <NameProvider value={{ firstName: 'Test' }}>
        <Header addButtonTitle="neues Modul" addFunctionOnClick={mockOnClick} />
        <Modal isOpen={true} onClose={() => {}}>
          <div>Modal Content</div>
        </Modal>
      </NameProvider>
    );

    // Find the button and click it
    const button = screen.getByRole('button', { name: /neues Modul/i });
    button.click(); // Simulate a click using .click()

    // Check if modal content is rendered
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });
});
