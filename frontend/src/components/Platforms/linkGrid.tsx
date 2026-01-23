import { LinkContainer, LinkContainerProps } from './LinkContainer';

type LinkGridProps = {
  data: {
    id: string; 
    src?: string;
    title: string;
    link: string;
  }[];
  onRemove: (id: string) => void; 
};

export function LinkGrid({ data, onRemove }: LinkGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-6">
      
      {data.map((item) => (
        <LinkContainer
          key={item.id}
          src={item.src}
          title={item.title}
          link={item.link}
          onRemove={() => onRemove(item.id)} 
        />
      ))}
    </div>
  );
}
