import { useEffect } from "react";

// components
import Title from "./Title";
import Inputs from "./inputs/@Inputs";
import Loading from "./Loading";
import Links from "./Links/@Links";
import HandleSaveButton from "./HandleSaveButton";

// mantine
import { Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";

// redux
import { useGetItemDetailsByReferenceIdQuery } from "@/features/items/store/items.api";
import { useAppDispatch } from "@/app/reduxHooks";
import { skipToken } from "@reduxjs/toolkit/query";
import { setItemReference } from "@/features/items/store/editItemReference.slice";


interface EditItemReferenceProps {
  itemReferenceId: ItemReference["id"];
  onSaved: () => void;
}

const EditItemReference = ({ itemReferenceId, onSaved }: EditItemReferenceProps) => {
  const dispatch = useAppDispatch();

  // fetch itemDetails
  const { currentData, error, isFetching } = useGetItemDetailsByReferenceIdQuery(
    itemReferenceId !== null && itemReferenceId !== undefined
      ? itemReferenceId
      : skipToken,
  );

  // error handler
  useEffect(() => {
    if (!error) return;

    const message = "error" in error
      ? error.error
      : error.message ?? "Não foi possível buscar os dados da referência.";

    notifications.show({
      title: "Erro ao buscar referência do item",
      message,
      position: "bottom-right",
      color: "pink",
    });
  }, [error])

  // setItemReference
  const itemReference = currentData?.item_with_reference_links;

  useEffect(() => {
    if (!itemReference) return;

    dispatch(setItemReference(itemReference));
  }, [dispatch, itemReference]);

  // loading
  if (isFetching || !itemReference) {
    return (
      <Loading />
    );
  }

  return (
    <Stack>
      <Title />
      <Inputs />
      <Links />
      <HandleSaveButton onSaved={onSaved} />
    </Stack>
  )
};

export default EditItemReference;