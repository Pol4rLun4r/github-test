import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import { quotationApi } from "./quotation.api";
import { resetAllBudgetData } from "./resetAllBudgetData.thunk";
import { setOriginalBudget } from "./originalBudgetSlice";
import type { BudgetFormScope } from "./@rootReducer";
import {
    selectBudgetItems,
    selectBudgetQuotation,
} from "./budgetForm.selectors";

interface SubmitBudgetArgs {
    scope: BudgetFormScope;
}

const getErrorMessage = (error: unknown) => {
    if (
        typeof error === "object" &&
        error !== null &&
        "error" in error &&
        typeof error.error === "string"
    ) {
        return error.error;
    }

    if (error instanceof Error) return error.message;

    return "Ocorreu um erro desconhecido ao salvar o orçamento.";
};

export const submitBudget = createAsyncThunk<
    void,
    SubmitBudgetArgs,
    { state: RootState; rejectValue: string }
>(
    "budgets/submitBudget",
    async ({ scope }, { dispatch, getState, rejectWithValue }) => {
        const state = getState();
        const quotation = selectBudgetQuotation(state, scope);
        const items = selectBudgetItems(state, scope);

        try {
            if (scope === "budget_form_create") {
                await dispatch(quotationApi.endpoints.createQuotation.initiate({
                    quotation: {
                        notes: quotation.notes,
                        amount: quotation.amount,
                        total_value: quotation.total_value,
                    },
                    items,
                })).unwrap();

                dispatch(resetAllBudgetData());
                return;
            }

            if (quotation.id === undefined) {
                return rejectWithValue("Não foi possível identificar o orçamento para edição.");
            }

            await dispatch(quotationApi.endpoints.updateQuotation.initiate({
                quotation: {
                    id: quotation.id,
                    status: quotation.status ?? 0,
                    amount: quotation.amount,
                    total_value: quotation.total_value,
                    notes: quotation.notes,
                },
                items,
            })).unwrap();

            dispatch(setOriginalBudget(null));
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    },
);
