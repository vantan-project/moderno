import { cardStore, CardStoreRequest } from "@/api/card-store";
import { ButtonWithIcon } from "@/components/shared/button-with-icon";
import { AddIcon } from "@/components/shared/icons/add-icon";
import { MantineTextInput } from "@/components/shared/mantine/mantine-text-input";
import { showToast } from "@/utils/show-toast";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  indexApi: () => void;
};

export function CardStoreButton({ indexApi }: Props) {
  const [exp, setExp] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const { register, setValue, getValues, handleSubmit, reset } = useForm<
    CardStoreRequest["card"]
  >({
    defaultValues: {
      number: "",
      expMonth: "",
      expYear: "",
      holderFirstName: "",
      holderLastName: "",
    },
  });

  useEffect(() => {
    if (!exp) return;
    const [month, year] = exp.split("/");
    setValue("expMonth", month);
    setValue("expYear", year);
  }, [exp]);

  const onSubmit = async () => {
    const res = await cardStore({
      card: getValues(),
    });
    showToast(res.success, res.messages);
    if (res.success) {
      indexApi();
      close();
      reset();
      setExp("");
    }
  };

  return (
    <>
      <button
        className="bg-core h-[100px] rounded-2xl flex items-center justify-center flex-shrink-0 text-void hover:bg-gray cursor-pointer"
        onClick={open}
      >
        <AddIcon />
        <p>カードを追加する</p>
      </button>

      <Modal
        classNames={{
          title: "!font-bold !text-xl",
        }}
        opened={opened}
        onClose={close}
        size="lg"
        title="カード情報登録"
        centered
      >
        <div className="flex flex-col gap-4">
          <MantineTextInput
            classNames={{
              input: "!py-5 !rounded-full !border-void",
            }}
            label="カード番号"
            placeholder="0000000000000000"
            {...register("number")}
            onChange={(e) =>
              setValue("number", e.target.value.replace(/[^0-9]/g, ""))
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <MantineTextInput
              classNames={{
                input: "!py-5 !rounded-full !border-void",
              }}
              label="カード名義（性）"
              placeholder="山田"
              {...register("holderFirstName")}
            />
            <MantineTextInput
              classNames={{
                input: "!py-5 !rounded-full !border-void",
              }}
              label="カード名義（名）"
              placeholder="太郎"
              {...register("holderLastName")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <MantineTextInput
              classNames={{
                input: "!py-5 !rounded-full !border-void",
              }}
              label="有効期限"
              placeholder="MM/YY"
              value={exp}
              onChange={(e) => {
                const text = e.target.value.replace(/[^0-9]/g, "");
                if (text.length > 2) {
                  const strExp = text.slice(0, 2) + "/" + text.slice(2);
                  setExp(strExp.slice(0, 5));
                } else {
                  setExp(text);
                }
              }}
            />
            <MantineTextInput
              classNames={{
                input: "!py-5 !rounded-full !border-void",
              }}
              label="セキュリティコード"
              placeholder="000"
            />
          </div>

          <div className="mt-10">
            <ButtonWithIcon icon={<AddIcon />} onClick={handleSubmit(onSubmit)}>
              登録する
            </ButtonWithIcon>
          </div>
        </div>
      </Modal>
    </>
  );
}
