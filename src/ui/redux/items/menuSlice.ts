// redux
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
    notes: ItemReference['notes'];
    reference_links: ReferenceLink[];
    item_versions: ItemVersion[];
};

const initialState: InitialState = {
    notes: "",
    reference_links: [],
    item_versions: [],
};

const menuSlice = createSlice({
    name: "get-all-item-references-by-search-menu",
    initialState,
    reducers: {
        setLinks: (state, action: PayloadAction<ReferenceLink[]>) => {
            state.reference_links = action.payload;
        },
        setNotes: (state, action: PayloadAction<ItemReference['notes']>) => {
            state.notes = action.payload;
        },
        setVersion: (state, action: PayloadAction<ItemVersion[]>) => {
            state.item_versions = action.payload;
        }
    }
});

export const { setLinks, setNotes, setVersion } = menuSlice.actions;

export default menuSlice.reducer;