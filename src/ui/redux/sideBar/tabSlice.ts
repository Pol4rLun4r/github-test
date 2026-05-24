import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type TabState = {
    activeTab: number;
}

const initialState: TabState = {
    activeTab: 0
}

const tabSlice = createSlice({
    name: "tab",
    initialState,
    reducers: {
        setActiveTab: (state, action: PayloadAction<number>) => {
            state.activeTab = action.payload;
        }
    }
})

export const { setActiveTab } = tabSlice.actions;

export default tabSlice.reducer;