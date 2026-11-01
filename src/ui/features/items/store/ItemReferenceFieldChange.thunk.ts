import type { AppDispatch } from "@/app/store";
import {
    updateItemReferenceField,
    type EditableReferenceField,
} from "./editItemReference.slice";

type ItemReferenceFieldChange = {
    key: keyof EditableReferenceField;
    value: string;
};

export const changeItemReferenceField = (payload: ItemReferenceFieldChange) =>
    (dispatch: AppDispatch): void => {
        dispatch(updateItemReferenceField(payload));
    };