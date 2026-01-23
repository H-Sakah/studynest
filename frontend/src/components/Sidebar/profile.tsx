import { Name } from '../User/name';
import Photo from '../../icons/photo.svg'; // Importiere das SVG als Komponente
import { ProfilePicture } from './profilePicture';

export type profileProps = {
  email: string;
};

export const Profile = ({ email }: profileProps) => {
  return (
    <div className="text-center mb-6">
      <ProfilePicture>
        <Photo />
      </ProfilePicture>
      <Name />
      <p className="text-sm text-gray-600">{email}</p>
    </div>
  );
};
