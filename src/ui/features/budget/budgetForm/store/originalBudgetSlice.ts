import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BudgetComparisonData } from "@/utils/budgetComparison";

const originalBudgetSlice = createSlice({
    name: "budget-original",
    initialState: null as BudgetComparisonData | null,
    reducers: {
        setOriginalBudget: (
            _state,
            action: PayloadAction<BudgetComparisonData | null>,
        ) => action.payload,
        setNull: () => null
    },
});

export const { setOriginalBudget } = originalBudgetSlice.actions;

export default originalBudgetSlice.reducer;
