// redux
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: SearchItemDescriptionIsOptional = ""

const searchSlice = createSlice({
    name: "get-all-item-references-by-search",
    initialState,
    reducers: {
        setSearch: (_state, action: PayloadAction<SearchItemDescriptionIsOptional>) => {
            return action.payload;
        },
        resetSearch: () => initialState,
    }
});

export const { resetSearch, setSearch } = searchSlice.actions;

export default searchSlice.reducer;