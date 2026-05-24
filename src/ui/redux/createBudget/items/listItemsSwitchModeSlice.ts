// redux

import { createSlice } from "@reduxjs/toolkit";

type ItemFormSwitchModeState = {
    mode: boolean;
}

const initialState: ItemFormSwitchModeState = {
    mode: true,
}

const listItemsSwitchModeSlice = createSlice({
    name: "list-items-switch-mode",
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
} = listItemsSwitchModeSlice.actions;

export default listItemsSwitchModeSlice.reducer;