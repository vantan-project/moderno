import { RemoveIcon } from "@/components/shared/icons/remove-icon";
import { AddIcon } from "@/components/shared/icons/add-icon";
import { useGlobalContext } from "@/hooks/use-global-state";

type Props = {
  furnitureId: number;
  stock: number;
};

export function OrderCounter({ furnitureId, stock }: Props) {
  const { cartCounts, setCartCounts } = useGlobalContext();
  const count = cartCounts[furnitureId] || 0;

  return (
    <div className="flex w-full h-full items-center justify-between rounded-lg overflow-hidden outline-2 outline-void bg-void">
      <button
        className="p-1 h-full cursor-pointer text-core"
        onClick={() => {
          if (count <= 0) {
            return;
          }
          setCartCounts({
            ...cartCounts,
            [furnitureId]: count - 1,
          });
        }}
      >
        <RemoveIcon />
      </button>
      <span className="flex-1 h-full flex items-center justify-center text-xl rounded-xl bg-core">
        {count}
      </span>
      <button
        className="p-1 h-full cursor-pointer text-core"
        onClick={() => {
          if (count >= stock) {
            return;
          }
          setCartCounts({
            ...cartCounts,
            [furnitureId]: count + 1,
          });
        }}
      >
        <AddIcon />
      </button>
    </div>
  );
}
