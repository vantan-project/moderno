type Props = {
  text: string;
  label: string;
};

export function TextWithLabel({ text, label }: Props) {
  return (
    <h1 className="h-12 flex gap-0.5">
      <span className="text-[4rem] leading-[0.8]">{text[0]}</span>
      <div>
        <p className="text-sm pl-1 pb-1">{label}</p>
        <p className="text-[2rem] leading-[0.8]">
          {text.slice(1, text.length)}
        </p>
      </div>
    </h1>
  );
}
