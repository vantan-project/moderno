type Props = {
  icon: React.ReactNode;
  children: React.ReactNode;
  color?: string;
  backgroundColor?: string;
  onClick?: () => void;
};

export function ButtonWithIcon({
  icon,
  children,
  color,
  backgroundColor,
  onClick,
}: Props) {
  return (
    <button
      className="w-full py-2 rounded-2xl flex justify-center items-center gap-4 cursor-pointer"
      style={{
        color: color || "var(--color-core)",
        backgroundColor: backgroundColor || "var(--color-void)",
      }}
      onClick={onClick}
    >
      {icon}
      {children}
    </button>
  );
}
