// redux
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
    notes: ItemReference['notes'];
    reference_links: ReferenceLink[];
    item_values: ItemValues[];
};

const initialState: InitialState = {
    notes: "",
    reference_links: [],
    item_values: [],
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
        setAllItemValues: (state, action: PayloadAction<ItemValues[]>) => {
            state.item_values = action.payload;
        }
    }
});

export const { setLinks, setNotes, setAllItemValues } = menuSlice.actions;

export default menuSlice.reducer;