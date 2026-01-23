
import { AddButton } from './addButton';
import { Greeting } from './greeting';

export type HeaderProps = {
  addButtonTitle: string;
  addFunctionOnClick?: () => void;
};

export const Header = ({ addButtonTitle, addFunctionOnClick }: HeaderProps) => {
  return (
    <div className="flex justify-between items-center bg-white shadow px-6 py-4 mb-4">
      <div>
        <Greeting />
      </div>
      <div className="flex items-center gap-4">
       
        <AddButton title={addButtonTitle} onClickAction={addFunctionOnClick} />
      </div>
    </div>
  );
};
