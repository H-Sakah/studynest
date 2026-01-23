import Link from "next/link";
import { ReactNode } from "react";

type SidebarButtonProps = {
  label: string;
  id: string;
  href?: string ; // Navigation link is required
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export const SidebarButton = ({ label, id, href , children, onClick }: SidebarButtonProps) => {
  return (
    <div className="mb-2">
      <Link
        href={href||'#'}
        className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 rounded transition-colors duration-200"
        onClick={onClick}      
      >
        {children}
        <span>{label}</span>
      </Link>
    </div>
  );
};
