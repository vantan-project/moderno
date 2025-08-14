import { PasswordInput, PasswordInputProps } from "@mantine/core";
import { EyeOffIcon } from "../icons/eye-off-icon";
import { EyeIcon } from "../icons/eye-icon";

export function MantinePasswordInput(props: PasswordInputProps) {
  return (
    <PasswordInput
      {...props}
      classNames={{
        input: "!py-5 !border-none !rounded-full",
        section: "px-2",
        visibilityToggle: "hover:!bg-transparent hover:opacity-80",
        ...props.classNames,
      }}
      visibilityToggleIcon={({ reveal }) =>
        reveal ? (
          <EyeOffIcon className="w-5 h-5" />
        ) : (
          <EyeIcon className="w-5 h-5" />
        )
      }
    />
  );
}
