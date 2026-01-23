import { SidebarButton } from './sidebarButton';
import DashboardIcon from '../../icons/dashboard.svg';
import ModulesIcon from '../../icons/modules.svg';
import PlatformIcon from '../../icons/platform.svg';
import TasksIcon from '../../icons/tasks.svg';
import LogoutIcon from '../../icons/logout.svg';
import { useState } from 'react';
import { LogoutPopup } from './logoutPopup'; // Pfad entsprechend anpassen

type SidebarButtonListProps = {
  isCollapsed: boolean;
};

const handleLogout = async () => {
  try {
    
    await fetch('http://localhost:4000/api/logout', {
      method: 'POST',
      credentials: 'include', 
    });

  
    window.location.href = '/login';
  } catch (err) {
    if (err instanceof Error) {
      console.error('Fehler beim Logout:', err.message);
    } else {
      console.error('Fehler beim Logout:', err);
    }
  }
};

export const SidebarButtonList = ({ isCollapsed }: SidebarButtonListProps) => {
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);

  return (
    <div
      className={
        !isCollapsed
          ? 'flex flex-col gap-2'
          : 'flex flex-col gap-2 justify-center min-h-screen'
      }
    >
      {/* Dashboard */}
      <SidebarButton
        id="dashboard"
        label={!isCollapsed ? 'Dashboard' : ''}
        href="/dashboard"
      >
        <DashboardIcon
          className={`w-6 h-6 text-gray-600 ${!isCollapsed ? 'mr-4' : ''}`}
        />
      </SidebarButton>

      {/* Meine Module */}
      <SidebarButton
        id="modules"
        label={!isCollapsed ? 'Meine Module' : ''}
        href="/meineModule"
      >
        <ModulesIcon
          className={`w-6 h-6 text-gray-600 ${!isCollapsed ? 'mr-4' : ''}`}
        />
      </SidebarButton>

      {/* Tasks */}
      <SidebarButton
        id="tasks"
        label={!isCollapsed ? 'Tasks' : ''}
        href="/tasks"
      >
        <TasksIcon
          className={`w-6 h-6 text-gray-600 ${!isCollapsed ? 'mr-4' : ''}`}
        />
      </SidebarButton>

      {/* Platforms */}
      <SidebarButton
        id="student-platforms"
        label={!isCollapsed ? 'Platforms' : ''}
        href="/platforms"
      >
        <PlatformIcon
          className={`w-6 h-6 text-gray-600 ${!isCollapsed ? 'mr-4' : ''}`}
        />
      </SidebarButton>
      {/* Logout */}
      <SidebarButton
        id="logout"
        label={!isCollapsed ? 'Logout' : ''}
        onClick={() => setIsLogoutPopupOpen(true)}
      >
        <LogoutIcon
          className={`w-6 h-6 text-gray-600 ${!isCollapsed ? 'mr-4' : ''}`}
        />
      </SidebarButton>
      <LogoutPopup
        isOpen={isLogoutPopupOpen}
        onClose={() => setIsLogoutPopupOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};
