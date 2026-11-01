import { combineReducers } from "@reduxjs/toolkit";

// slicers
import itemTableSlice from "./itemTable.slice";
import itemTableSwitchSlice from "./itemTableSwitch.slice";
import quotationInfoSlice from './quotationInfo.slice';
import originalBudgetSlice from "./originalBudgetSlice";

export type BudgetFormScope = "budget_form_create" | "budget_form_edit";

const budgetFormReducer = combineReducers({
    quotationInfo: quotationInfoSlice,
    itemTable: itemTableSlice,
    itemTableSwitch: itemTableSwitchSlice,
    originalBudget: originalBudgetSlice,
});

export default budgetFormReducer;
