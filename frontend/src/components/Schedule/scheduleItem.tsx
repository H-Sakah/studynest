export type scheduleItemProps = {
  time: string;
  description: string;
};

export const ScheduleItem = ({ time, description }: scheduleItemProps) => {
  return (
    <>
      <span className="font-medium">{time}</span>
      <span>{description}</span>
    </>
  );
};
