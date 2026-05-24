// redux
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: CreateQuotation = {
    notes: undefined,
    status: 0,
    amount: 0,
    total_value: 0
}

const quotationSlice = createSlice({
    name: "create-budget-quotation",
    initialState,
    reducers: {
        setNotes: (state, action: PayloadAction<string>) => {
            state.notes = action.payload;
        },
        setStatus: (state, action: PayloadAction<QuotationStatus>) => {
            state.status = action.payload;
        },
        setAmount: (state, action: PayloadAction<CreateQuotation['amount']>) => {
            state.amount = action.payload;
        },
        setTotalValue: (state, action: PayloadAction<CreateQuotation['total_value']>) => {
            state.total_value = action.payload;
        },
        setQuotation: (_state, action: PayloadAction<CreateQuotation>) => action.payload,
        resetQuotation: () => initialState,
    }
})

export const { setNotes, setStatus, setQuotation, resetQuotation, setAmount, setTotalValue } = quotationSlice.actions;

export default quotationSlice.reducer;