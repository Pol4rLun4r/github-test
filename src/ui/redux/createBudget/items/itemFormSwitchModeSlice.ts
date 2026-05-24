// redux

import { createSlice } from "@reduxjs/toolkit";

type ItemFormSwitchModeState = {
    mode: boolean;
}

const initialState: ItemFormSwitchModeState = {
    mode: false,
}

const itemFormSwitchModeSlice = createSlice({
    name: "item-form-switch-mode",
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
} = itemFormSwitchModeSlice.actions;

export default itemFormSwitchModeSlice.reducer;