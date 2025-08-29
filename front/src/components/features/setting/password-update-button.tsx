import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { useState } from "react";
import { MantinePasswordInput } from "@/components/shared/mantine/mantine-password-input";
import { LockIcon } from "@/components/shared/icons/lock-icon";
import { authUpdate } from "@/api/auth-update";
import { showToast } from "@/utils/show-toast";

type Props = {
  className?: string;
};

export function PasswordUpdateButton({ className }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassowrd] = useState("");

  const updateApi = async () => {
    if (password !== confirmPassword) {
      showToast(false, ["パスワードが一致していません。"]);
      return;
    }

    const res = await authUpdate({
      auth: { password: password },
    });

    showToast(res.success, res.messages);

    if (res.success) {
      close();
      setPassword("");
      setConfirmPassowrd("");
    }
  };

  return (
    <>
      <button onClick={open} className={className}>
        パスワードを変更する
      </button>

      <Modal opened={opened} onClose={close} title="パスワード変更" centered>
        <div className="flex flex-col gap-4">
          <MantinePasswordInput
            label="パスワード"
            value={password}
            leftSection={<LockIcon className="w-5 h-5" />}
            onChange={(e) => setPassword(e.target.value)}
            classNames={{
              input: "!border !border-void",
            }}
          />
          <MantinePasswordInput
            label="パスワード（確認）"
            value={confirmPassword}
            leftSection={<LockIcon className="w-5 h-5" />}
            onChange={(e) => setConfirmPassowrd(e.target.value)}
            classNames={{
              input: "!border !border-void",
            }}
          />
          <div className="grid grid-cols-2 gap-4">
            <button
              className="rounded-lg py-2 border cursor-pointer"
              onClick={close}
            >
              キャンセル
            </button>
            <button
              className="rounded-lg py-2 text-core bg-error cursor-pointer"
              onClick={() => updateApi()}
            >
              パスワード変更
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
