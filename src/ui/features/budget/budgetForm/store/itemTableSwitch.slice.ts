// redux

import { createSlice } from "@reduxjs/toolkit";

type ItemFormSwitchModeState = {
    mode: boolean;
}

const initialState: ItemFormSwitchModeState = {
    mode: true,
}

const itemTableSwitchSlice = createSlice({
    name: "item-table-switch",
    initialState,
    reducers: {
        setModeOn: (state) => { state.mode = true },
        setModeOff: (state) => { state.mode = false },
        resetMode: () => initialState
    }
})

export const {
    resetMode,
    setModeOff,
    setModeOn,
} = itemTableSwitchSlice.actions;

export default itemTableSwitchSlice.reducer;