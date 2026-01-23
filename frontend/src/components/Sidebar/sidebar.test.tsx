import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from './sidebar';
import { describe, it, expect, vi } from 'vitest';
import { NameProvider } from '../User/nameContext';

describe('Sidebar Component', () => {
  const mockToggleCollapse = vi.fn();
  
  describe('Expanded State', () => {
    it('renders all buttons and labels', () => {
      render(
        <NameProvider value={{ firstName: 'Test'}}>
          <Sidebar
            profilePicture="test-profile.jpg"
            email="test@example.com"
            isCollapsed={false}
            toggleCollapse={mockToggleCollapse}
          />
        </NameProvider>  
      );
  
      // Check for button labels in expanded state
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Meine Module')).toBeInTheDocument();
      expect(screen.getByText('Tasks')).toBeInTheDocument();
      expect(screen.getByText('Platforms')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  describe('Collapsed State', () => {
    it('renders icons only', () => {
      render(
        <NameProvider value={{ firstName: 'Test'}}>
          <Sidebar
            profilePicture="test-profile.jpg"
            email="test@example.com"
            isCollapsed={true}
            toggleCollapse={mockToggleCollapse}
          />
        </NameProvider>
      );
  
      // Check for icons (labels should not appear)
      expect(screen.queryByText('Dashboard')).toBeNull();
      expect(screen.queryByText('Meine Module')).toBeNull();
      expect(screen.queryByText('Tasks')).toBeNull();
      expect(screen.queryByText('Platforms')).toBeNull();
      expect(screen.queryByText('Logout')).toBeNull();
    });
  });
});
