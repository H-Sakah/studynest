import { Header } from '../Header/header';
import { LinkGrid } from './linkGrid';
import { addLink, deleteLink } from '../../firebase/firebaseLinksService';

type PlatformsContentProps = {
  links: { id: string; title: string; link: string; src?: string }[];
  onAdd: () => void;
  onRemove: (id: string) => void;
};

export const PlatformsContent = ({
  links,
  onAdd,
  onRemove,
}: PlatformsContentProps) => {
  return (
    <div>
      <Header addButtonTitle="neuer Link" addFunctionOnClick={onAdd} />
      <LinkGrid data={links} onRemove={(id) => onRemove(id)} />
    </div>
  );
};
