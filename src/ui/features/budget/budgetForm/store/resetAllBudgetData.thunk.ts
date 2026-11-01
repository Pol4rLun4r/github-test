// redux resets
import { resetItemForm } from "../../itemForm/store/itemForm.slice.ts";
import { resetStep } from "../../itemForm/store/steps.slice.ts";
import { resetReferenceLink } from "../../itemForm/store/linkForm.slice.ts";
import { resetTable } from "./itemTable.slice.ts";
import { resetQuotation } from "./quotationInfo.slice.ts";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const resetAllBudgetData = createAsyncThunk(
    "budgets/resetAllBudgetData",
    (_: void, { dispatch }) => {
        dispatch(resetItemForm("item_form_add"));
        dispatch(resetItemForm("item_form_edit"));
        dispatch(resetStep("item_form_add"));
        dispatch(resetStep("item_form_edit"));
        dispatch(resetReferenceLink("item_form_add"));
        dispatch(resetReferenceLink("item_form_edit"));
        dispatch(resetTable("budget_form_create"));
        dispatch(resetQuotation("budget_form_create"));
    },
);