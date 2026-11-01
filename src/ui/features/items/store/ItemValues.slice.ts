// redux
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = Partial<ItemValues>;

const initialState: InitialState = {
    id: undefined,
    item_reference_id: undefined,
    position: undefined,
    quantity: undefined,
    unit_price: undefined,
    markup: undefined,
    purchase_shipping: undefined,
    ipi: undefined,
    st: undefined,
    extra_value: undefined,
    boarding: undefined,
    delivery: undefined,
    created_at: undefined,
    updated_at: undefined,
};

const itemValuesSlice = createSlice({
    name: "item-values",
    initialState,
    reducers: {
        setItemValues: (_state, action: PayloadAction<InitialState>) => {
            return action.payload;
        },
        resetItemValues: () => initialState
    }
})

export const { resetItemValues, setItemValues } = itemValuesSlice.actions;

export default itemValuesSlice.reducer;