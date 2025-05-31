import { RemoveIcon } from "@/components/icons/remove-icon";
import { Order } from "./page";
import { AddIcon } from "@/components/icons/add-icon";

type Props = {
    order: Order,
    setOrder: React.Dispatch<React.SetStateAction<Order>>;
}

export function OrderCounter({ order, setOrder }: Props) {
  return (
    <div className="flex w-full items-center justify-between rounded-2xl overflow-hidden outline-2 outline-gray bg-gray">
      <button
        className="p-1 h-full cursor-pointer"
        onClick={() => {
          if (order.count <= 1) {
            return;
          }
          setOrder({ ...order, count: order.count - 1 });
        }}
      >
        <RemoveIcon />
      </button>
      <span className="flex-1 h-full flex items-center justify-center text-xl rounded-2xl bg-core">
        {order.count}
      </span>
      <button
        className="p-1 h-full cursor-pointer"
        onClick={() => {
          if (order.count >= 99) {
            return;
          }
          setOrder({ ...order, count: order.count + 1 });
        }}
      >
        <AddIcon />
      </button>
    </div>
  );
}
