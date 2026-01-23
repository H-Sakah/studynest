import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from './header';
import { NameProvider } from '../User/nameContext';

describe('Header Component', () => {
  it('renders the add button with the correct title', () => {
    const mockOnClick = vi.fn(); // Mock function for the click handler
    render(
        <NameProvider value={{ firstName: 'Test' }}>
            <Header addButtonTitle="neues Modul" addFunctionOnClick={mockOnClick} />
        </NameProvider>
    );
    // Check if the button renders
    const button = screen.getByRole('button', { name: /neues Modul/i });
    expect(button).toBeInTheDocument();
  });

  it('calls the addFunctionOnClick handler when clicked', () => {
    const mockOnClick = vi.fn(); // Mock function for the click handler
    render(
        <NameProvider value={{ firstName: 'Test' }}>    
            <Header addButtonTitle="neues Modul" addFunctionOnClick={mockOnClick} />
        </NameProvider>
    );

    const button = screen.getByRole('button', { name: /neues Modul/i });
    button.click();

    // Check if the handler was called
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
