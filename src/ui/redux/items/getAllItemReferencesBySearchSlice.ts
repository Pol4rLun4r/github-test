// redux
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: SearchItemDescriptionIsOptional = ""

const getAllItemReferencesBySearchSlice = createSlice({
    name: "get-all-item-references-by-search",
    initialState,
    reducers: {
        setSearch: (_state, action: PayloadAction<SearchItemDescriptionIsOptional>) => {
            return action.payload;
        },
        resetSearch: () => initialState,
    }
});

export const { resetSearch, setSearch } = getAllItemReferencesBySearchSlice.actions;

export default getAllItemReferencesBySearchSlice.reducer;