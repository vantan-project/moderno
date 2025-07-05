type Props = {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
};

export function ButtonWithLabel({ onClick, label, children }: Props) {
  return (
    <button
      className="flex flex-col items-center cursor-pointer gap-1"
      type="button"
      onClick={onClick}
    >
      <div className="w-10 h-10">
        {children}
      </div>
      <p className="text-[10px]">{label}</p>
    </button>
  );
}
