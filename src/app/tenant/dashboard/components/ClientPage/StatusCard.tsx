interface StatusCardProps {
  count: number;
  label: string;
  bgColor: string;
  textColor?: string;
}

export function StatusCard({
  count,
  label,
  bgColor,
  textColor = 'text-[#4A4459]',
}: StatusCardProps) {
  return (
    <div
      className={`flex flex-1 flex-col items-center justify-center gap-1.25 rounded-[20px] ${bgColor} px-5 py-5`}
    >
      <div
        className={`font-inter text-[32px] font-semibold leading-[120%] tracking-[-0.64px] ${textColor}`}
      >
        {count}
      </div>
      <div
        className={`font-roboto text-sm font-medium leading-5 tracking-[0.1px] ${textColor}`}
      >
        {label}
      </div>
    </div>
  );
}
