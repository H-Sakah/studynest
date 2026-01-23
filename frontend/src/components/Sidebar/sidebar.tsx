import { Logo } from './logo';
import { Profile } from './profile';
import { SidebarButtonList } from './sidebarButtonList';
import ArrowLeft from '../../icons/arrowLeft.svg';
import ArrowRight from '../../icons/arrowRight.svg';

export type SidebarProps = {
  profilePicture: string;
  email: string;
  isCollapsed: boolean;
  toggleCollapse: () => void;
};

export const Sidebar = ({
  email,
  isCollapsed,
  toggleCollapse,
}: SidebarProps) => {
  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-gray-100 ${
        isCollapsed ? 'w-16' : 'w-64'
      } transition-all duration-300`}
    >
      <div
        className={`fixed top-5 left-0 h-screen bg-gray-100 ${
          isCollapsed ? 'w-16' : 'w-64'
        } transition-all duration-300`}
      >
        {!isCollapsed && <Logo />}
        {!isCollapsed && <Profile email={email} />}
        <SidebarButtonList isCollapsed={isCollapsed} />
      </div>
      <button
        onClick={toggleCollapse}
        className="absolute bottom-20 right-4 bg-gray-300 rounded p-2 hover:bg-customBeige transition-all focus:ring-2 focus:ring-gray-300"
      >
        {isCollapsed ? <ArrowRight /> : <ArrowLeft />}
      </button>
    </div>
  );
};
