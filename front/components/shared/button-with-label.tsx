type Props = {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
};

export function ButtonWithLabel({ onClick, label, children }: Props) {
  return (
    <button
      className="flex flex-col items-center cursor-pointer gap-0.5"
      type="button"
      onClick={onClick}
    >
      {children}
      <p className="text-[10px]">{label}</p>
    </button>
  );
}
