import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";

type Props = {
  className?: string;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
};

export function ConfirmButton({ className, onClick, children, title }: Props) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <button className={className} onClick={open}>
        {children}
      </button>
      <Modal opened={opened} onClose={close} title={title}>
        <div className="grid grid-cols-2 gap-4">
          <button
            className="rounded-lg py-2 border cursor-pointer"
            onClick={close}
          >
            キャンセル
          </button>
          <button
            className="rounded-lg py-2 text-core bg-error cursor-pointer"
            onClick={onClick}
          >
            {children}
          </button>
        </div>
      </Modal>
    </>
  );
}
