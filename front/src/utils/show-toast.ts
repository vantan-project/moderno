import { showNotification } from "@mantine/notifications";

export async function showToast(success: boolean, messages: string[]) {
  for (const message of messages) {
    showNotification({
      message: message,
      color: success ? "green" : "red",
      withCloseButton: false,
      autoClose: 5000,
      styles: {
        root: {
          backgroundColor: "var(--color-void)",
        },
        description: {
          color: "var(--color-core)",
        },
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
