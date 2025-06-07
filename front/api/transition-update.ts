import axios from "axios";

export type TransitionUpdateRequest = {
  toFurnitureId: number;
  fromFurnitureId: number;
};

export async function TransitionUpdate({
  toFurnitureId,
  fromFurnitureId,
}: TransitionUpdateRequest) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/transition`;

  await axios.patch(apiUrl, {
    toFurnitureId,
    fromFurnitureId,
  });
}
