import { StatCard, statCardProps as statCardProps } from './statCard';

export type statsListProps = {
  stats: statCardProps[];
};

export const StatCardList = ({ stats }: statsListProps) => {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Statistiken</h2>
      <div className="flex gap-4 mt-6">
        {stats.map((stat, index) => (
          <StatCard key={index} value={stat.value} label={stat.label} />
        ))}
      </div>
    </div>
  );
};
