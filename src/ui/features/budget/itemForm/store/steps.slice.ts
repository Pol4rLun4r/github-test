// redux
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// types
import type { ItemFormScope } from "./itemForm.slice";

export interface stepsType {
    step: number;
}

export interface ItemFormStepsSliceState {
    item_form_add: stepsType;
    item_form_edit: stepsType;
    item_form_add_budget_edit: stepsType;
}

export const createEmptySteps = (): stepsType => {
    return {
        step: 0,
    };
};

const initialState: ItemFormStepsSliceState = {
    item_form_add: createEmptySteps(),
    item_form_edit: createEmptySteps(),
    item_form_add_budget_edit: createEmptySteps(),
}

const itemFormStepsSlice = createSlice({
    name: 'item-form-steps',
    initialState,
    reducers: {
        incrementStep: (
            state, action: PayloadAction<ItemFormScope>
        ) => {
            state[action.payload].step = state[action.payload].step + 1
        },
        decrementStep: (
            state, action: PayloadAction<ItemFormScope>
        ) => {
            state[action.payload].step = state[action.payload].step - 1
        },
        resetStep: (state, action: PayloadAction<ItemFormScope>) => {
            const empty = createEmptySteps();
            state[action.payload] = empty;
        },
    }
});

export const { decrementStep, incrementStep, resetStep } = itemFormStepsSlice.actions;

export default itemFormStepsSlice.reducer;