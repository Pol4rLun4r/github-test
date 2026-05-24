// redux
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// types
import { type ItemFormScope } from "./itemFormSlice";

export interface stepsType {
    step: number;
}

export interface ItemFormStepsSliceState {
    add: stepsType;
    edit: stepsType;
}

export const createEmptySteps = (): stepsType => {
    return {
        step: 0,
    };
};

const initialState: ItemFormStepsSliceState = {
    add: createEmptySteps(),
    edit: createEmptySteps(),
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