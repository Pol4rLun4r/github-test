// redux
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type EditableReferenceField = Pick<
    ItemReference,
    "description" | "internal_code" | "manufacturer_code" | "ncm" | "notes"
>;

type EditItemReferenceState = (ItemWithReferenceLinks & {
    originalItem: ItemWithReferenceLinks;
}) | null;

const initialState = null as EditItemReferenceState;

const editItemReferenceSlice = createSlice({
    name: "item-reference",
    initialState,
    reducers: {
        setItemReference: (_state, action: PayloadAction<ItemWithReferenceLinks>) => {
            return {
                ...action.payload,
                reference_links: action.payload.reference_links.map((link) => ({ ...link })),
                originalItem: {
                    ...action.payload,
                    reference_links: action.payload.reference_links.map((link) => ({ ...link })),
                },
            };
        },
        updateItemReferenceField: (
            state,
            action: PayloadAction<{ key: keyof EditableReferenceField; value: string }>,
        ) => {
            if (state) {
                state[action.payload.key] = action.payload.value;
            }
        },
        addReferenceLink: (state) => {
            if (state?.id === undefined) return;

            state.reference_links.unshift({
                item_reference_id: state.id,
                content: "",
            });
        },
        updateReferenceLink: (
            state,
            action: PayloadAction<{ index: number; content: string }>,
        ) => {
            const link = state?.reference_links[action.payload.index];
            if (link) link.content = action.payload.content;
        },
        removeReferenceLink: (state, action: PayloadAction<number>) => {
            state?.reference_links.splice(action.payload, 1);
        },
        resetItemReference: () => initialState,
    },
});

export const {
    setItemReference,
    updateItemReferenceField,
    addReferenceLink,
    updateReferenceLink,
    removeReferenceLink,
    resetItemReference,
} = editItemReferenceSlice.actions;

export default editItemReferenceSlice.reducer;