// redux
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
    itemWithReferenceLinks?: ItemWithReferenceLinks;
    latestPrice?: ItemValues;
    records?: number;
};

const initialState: InitialState = {
    itemWithReferenceLinks: undefined,
    latestPrice: undefined,
    records: undefined
};

const itemDetailsSlice = createSlice({
    name: "item-details",
    initialState,
    reducers: {
        setItemWithReferenceLinks: (state, action: PayloadAction<ItemWithReferenceLinks>) => {
            state.itemWithReferenceLinks = action.payload;
        },
        setLatestPrice: (state, action: PayloadAction<ItemValues>) => {
            state.latestPrice = action.payload;
        },
        setRecords: (state, action: PayloadAction<number>) => {
            state.records = action.payload;
        },
        setItem: (_state, action: PayloadAction<InitialState>) => {
            return action.payload;
        }
    }
})

export const { setItem } = itemDetailsSlice.actions;

export default itemDetailsSlice.reducer;