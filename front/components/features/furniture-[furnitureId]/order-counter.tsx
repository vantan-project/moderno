import { RemoveIcon } from "@/components/shared/icons/remove-icon";
import { Order } from "../../../app/furniture/[furnitureId]/page";
import { AddIcon } from "@/components/shared/icons/add-icon";

type Props = {
  order: Order;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
  stock: number;
};

export function OrderCounter({ order, setOrder, stock }: Props) {
  return (
    <div className="flex w-full items-center justify-between rounded-2xl overflow-hidden outline-2 outline-void bg-void">
      <button
        className="p-1 h-full cursor-pointer text-core"
        onClick={() => {
          if (order.count <= 0) {
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
        className="p-1 h-full cursor-pointer text-core"
        onClick={() => {
          if (order.count >= stock) {
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
