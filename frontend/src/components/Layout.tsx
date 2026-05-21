import { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar/sidebar';
import { Schedule } from './Schedule/schedule';
import { UploadSchedule } from './Schedule/uploadSchedule';
import { useSchedule } from '../hooks/useSchedule';

export type LayoutProps = {
  children: React.ReactNode;
  userId: string | null;
  userData: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

export const Layout = ({ children, userId, userData }: LayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isScheduleCollapsed, setIsScheduleCollapsed] = useState(true);

  const {
    schedule,
    isLoading: isLoadingSchedule,
    handleFileUpload,
    handleDeleteSchedule,
  } = useSchedule(userId);

  return (
    <div className="flex ">
      {/* Sidebar */}
      <div
        className={`bg-gray-100 flex flex-col justify-between transition-width duration-300 ${
          isSidebarCollapsed ? 'w-10' : 'w-1/8'
        } `}
      >
        <Sidebar
          profilePicture="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg"
          email={userData.email}
          isCollapsed={isSidebarCollapsed}
          toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 flex-grow p-4 ${
          isSidebarCollapsed ? 'ml-10' : 'ml-60'
        }`}
      >
        {children}
      </div>

      {/* Schedule */}
      <div className="mr-10">
        {isLoadingSchedule ? (
          <div className="text-center text-gray-500">
            Veranstaltungsplan wird geladen...
          </div>
        ) : schedule.length === 0 ? (
          <UploadSchedule
            upload={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            toggleCollapse={() => setIsScheduleCollapsed(!isScheduleCollapsed)}
          />
        ) : (
          <Schedule
            schedule={schedule}
            handleDeleteSchedule={handleDeleteSchedule}
            isCollapsed={isScheduleCollapsed}
            toggleCollapse={() => setIsScheduleCollapsed(!isScheduleCollapsed)}
          />
        )}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 flex justify-between items-center ">
        <span>&copy; {new Date().getFullYear()} StudyNest</span>
        <div className="flex gap-4">
          <button
            className="underline"
            onClick={() => window.open('/impressum&&datenschutz', '_blank')}
          >
            Impressum und Datenschutz
          </button>
        </div>
      </div>
    </div>
  );
};
