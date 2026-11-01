import { combineReducers } from "@reduxjs/toolkit";

// slicers
import itemFormSlice from './itemForm.slice';
import switchSlice from "./switch.slice";
import stepsSlice from "./steps.slice"
import linkFormSlice from "./linkForm.slice"

const itemFormReducer = combineReducers({
    form: itemFormSlice,
    switch: switchSlice,
    steps: stepsSlice,
    linkForm: linkFormSlice
})

export default itemFormReducer;