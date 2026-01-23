import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from './sidebar';
import { describe, it, expect, vi } from 'vitest';
import { NameProvider } from '../User/nameContext';

describe('Sidebar component buttons navigation', () => {
    const mockToggleCollapse = vi.fn();

    it('navigates to the correct pages when buttons are clicked', () => {
        render(
            <NameProvider value={{ firstName: 'Test' }}>
                <Sidebar
                    profilePicture="test-profile.jpg"
                    email="test@example.com"
                    isCollapsed={false}
                    toggleCollapse={mockToggleCollapse}
                />
            </NameProvider>
        );
        
        // Simulate user clicking on "Dashboard" button
        const dashboardButton = screen.getByRole('link', { name: /dashboard/i });
        expect(dashboardButton).toHaveAttribute('href', '/dashboard');
    
        // Simulate user clicking on "Meine Module" button
        const modulesButton = screen.getByRole('link', { name: /meine module/i });
        expect(modulesButton).toHaveAttribute('href', '/meineModule');

        // Simulate user clicking on "Meine Module" button
        const tasksButton = screen.getByRole('link', { name: /tasks/i });
        expect(tasksButton).toHaveAttribute('href', '/tasks');

        // Simulate user clicking on "Meine Module" button
        const platformsButton = screen.getByRole('link', { name: /platforms/i });
        expect(platformsButton).toHaveAttribute('href', '/platforms');
    });
}) 