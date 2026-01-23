import { ModuleCard, moduleCardProps } from './moduleCard';

export type moduleCardListProps = {
  moduleCards: moduleCardProps[];
  containerClassName?: string;
  showDetailsButton?: boolean;
  showDeleteButton?: boolean;
  showEditButton?: boolean;
  showArrowButton?: boolean;
};

export const ModuleCardList = ({
  moduleCards,
  containerClassName = '',
  showDetailsButton = false,
  showDeleteButton = false,
  showEditButton = false,
  showArrowButton = false,
}: moduleCardListProps) => {
  return (
    <div className={containerClassName}>
      {moduleCards.map((card, index) => (
        <ModuleCard
          key={index}
          {...card}
          showDetailsButton={showDetailsButton}
          showDeleteButton={showDeleteButton}
          showEditButton={showEditButton}
          showArrowButton={showArrowButton}
        />
      ))}
    </div>
  );
};
