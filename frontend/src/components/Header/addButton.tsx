export type AddButtonProps = {
  title: string;
  onClickAction?: () => void;
};

export const AddButton = ({ title, onClickAction }: AddButtonProps) => {
  return (
    <button
      className="
        inline-flex
        items-center
        gap-2
        px-4
        py-2
        rounded-full
        font-medium
        uppercase
        text-white
        bg-gradient-to-r
        from-blue-500
        to-indigo-500
        hover:from-blue-600
        hover:to-indigo-600
        shadow
        hover:shadow-lg
        transform
        transition
        duration-300
        ease-in-out
        focus:outline-none
        focus:ring-2
        focus:ring-blue-300"
      onClick={onClickAction}
    >
      {title}
      <span className="material-icons">
      <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width={2.5} 
          stroke="currentColor" 
          className="w-5 h-5"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" 
          />
      </svg>
      </span>
    </button>
  );
};
