export type statCardProps = {
  value: number;
  label: string;
};

export const StatCard = ({ value, label }: statCardProps) => {
  return (
    <div className="bg-gray-100 rounded-lg shadow p-4 flex flex-col items-center justify-center w-32 h-32">
      <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
      <p className="text-sm text-gray-600 text-center">{label}</p>
    </div>
  );
};
