// utils
import calcAddItem from "@/utils/calcAddItem";
import { isDefinedMarkup, isDefinedNonNegative } from "@/utils/itemFormValidation";

// redux
import type { RootState } from "@/app/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ItemFormScope, resetItemForm } from "./itemForm.slice";
import { BudgetFormScope } from "../../budgetForm/store/@rootReducer";
import { addItem, editItem } from "../../budgetForm/store/itemTable.slice";
import { resetStep } from "./steps.slice";

interface SubmitItemFormArgs {
    scope: ItemFormScope;
    budgetScope: BudgetFormScope;
}

export const submitItemForm = createAsyncThunk<
    void,
    SubmitItemFormArgs,
    {
        state: RootState;
        rejectValue: string;
    }
>(
    "budgets/submitItemForm",
    async ({ scope, budgetScope }, { getState, dispatch, rejectWithValue }) => {
        const form = getState().itemForm.form[scope];
        const description = form.item_reference.description?.trim();

        if (!description) {
            return rejectWithValue("Informe a descrição do item.");
        }

        if (!isDefinedNonNegative(form.item_values.quantity)) {
            return rejectWithValue("Informe uma quantidade válida.");
        }

        if (!isDefinedMarkup(form.item_values.markup)) {
            return rejectWithValue("Informe um markup válido.");
        }

        const { stValue } = calcAddItem({
            ...form.item_values,
            switchStMode: form.toggleStMode,
        });

        const data = {
            ...form,
            toggleStMode: false,
            item_values: {
                ...form.item_values,
                st: stValue,
            },
        };

        if (scope === "item_form_edit") {
            dispatch(editItem({ scope: budgetScope, data }));
        } else {
            dispatch(addItem({ scope: budgetScope, data }));
        }

        dispatch(resetItemForm(scope));
        dispatch(resetStep(scope))
    },
);