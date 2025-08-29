import { SearchIcon } from "./icons/search-icon";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Search({ value, onChange }: Props) {
  return (
    <div className="fixed top-10 left-1/2 -translate-x-1/2 z-10">
      <div className="relative w-fit">
        <input
          className="w-[40vw] bg-core border-2 border-void text-void p-2 pr-8 rounded-md [&::placeholder]:text-void [&::placeholder]:font-bold"
          placeholder="検索"
          onChange={onChange}
          value={value}
        />
        <div className="absolute top-1/2 -translate-y-1/2 right-2">
          <SearchIcon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
}
