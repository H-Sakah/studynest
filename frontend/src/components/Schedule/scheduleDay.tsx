import { ScheduleItem, scheduleItemProps } from './scheduleItem';

export type scheduleDayProps = {
  day: string;
  items: scheduleItemProps[];
};

export const ScheduleDay = ({ day, items }: scheduleDayProps) => {
  return (
    <div className="mb-4">
      <h3 className="font-bold text-700 mb-2">{day}:</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li className="flex justify-between items-center text-gray-700 border-b border-customBrown-200 pb-2">
            <ScheduleItem
              key={index}
              time={item.time}
              description={item.description}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
