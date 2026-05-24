// redux 
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// type
import type { ItemFormScope } from "./itemFormSlice.ts";

export interface ReferenceLinkFormState {
    add: Partial<ReferenceLink>;
    edit: Partial<ReferenceLink>;
};

const createEmptyNoteData = (): Partial<ReferenceLink> => {
    return {
        content: '',
    };
};

const initialState: ReferenceLinkFormState = {
    add: createEmptyNoteData(),
    edit: createEmptyNoteData(),
};

const draft = (state: ReferenceLinkFormState, scope: ItemFormScope): Partial<ReferenceLink> => {
    return state[scope];
};

const ReferenceLinkFormSlice = createSlice({
    name: "item-reference-link-form",
    initialState,
    reducers: {
        setReferenceLink: (
            state,
            action: PayloadAction<{ scope: ItemFormScope; content: string }>) => {
            draft(state, action.payload.scope).content = action.payload.content;
        },
        resetReferenceLink: (state, action: PayloadAction<ItemFormScope>) => {
            const empty = createEmptyNoteData();
            state[action.payload] = empty;
        }
    }
});

export const {
    resetReferenceLink,
    setReferenceLink,
} = ReferenceLinkFormSlice.actions;

export default ReferenceLinkFormSlice.reducer;