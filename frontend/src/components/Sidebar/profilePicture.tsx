import { ReactNode } from 'react';

export type profilePictureProps = {
  children: ReactNode;
};

export const ProfilePicture = ({ children }: profilePictureProps) => {
  return (
    <div className="w-40 h-40 rounded-full overflow-hidden mx-auto flex items-center justify-center bg-gray-200 mb-4">
      {children}
    </div>
  );
};
