type Props = {
  icon: React.ReactNode;
  children: React.ReactNode;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  onClick?: () => void;
};

export function ButtonWithIcon({
  icon,
  children,
  color,
  backgroundColor,
  borderColor,
  onClick,
}: Props) {
  return (
    <button
      className="w-full py-2 rounded-lg flex justify-center items-center gap-4 cursor-pointer border"
      style={{
        color: color || "var(--color-core)",
        backgroundColor: backgroundColor || "var(--color-void)",
        borderColor: borderColor || "var(--color-void)",
      }}
      onClick={onClick}
    >
      {icon}
      {children}
    </button>
  );
}
