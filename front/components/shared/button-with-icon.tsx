type Props = {
  icon: React.ReactNode;
  children: React.ReactNode;
};

export function ButtonWithIcon({ icon, children }: Props) {
  return (
    <button className="bg-gray w-full py-2 rounded-2xl flex justify-center items-center gap-4 cursor-pointer">
      {icon}
      {children}
    </button>
  );
}
