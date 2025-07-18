import { TextInput, TextInputProps } from "@mantine/core";

export function MantineTextInput(props: TextInputProps) {
  return (
    <TextInput
      {...props}
      classNames={{
        input: "!py-5 !border-none !rounded-full",
        section: "px-2",
      }}
    />
  );
}
