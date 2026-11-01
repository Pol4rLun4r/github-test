// redux
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { ItemFormState } from "../../itemForm/store/itemForm.slice";
import { BudgetFormScope } from "./@rootReducer";

export interface ItemTableState {
    budget_form_create: ItemFormState[];
    budget_form_edit: ItemFormState[];
}

type ItemTableInput = Omit<ItemFormState, "temp_id" | "toggleStMode">;

export const createEmptyItemsData = (): ItemFormState[] => {
    return []
};

const initialState: ItemTableState = {
    budget_form_create: createEmptyItemsData(),
    budget_form_edit: createEmptyItemsData()
};

const draft = (state: ItemTableState, scope: BudgetFormScope): ItemFormState[] => {
    return state[scope];
};

/** função para criar um id temporário aos items, cuja finalidade é diferenciar os itens para manipulação */
function newTemId(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return `item-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

const itemTableSlice = createSlice({
    name: "budget-item-table",
    initialState,
    reducers: {
        addItem: (
            state: ItemTableState,
            action: PayloadAction<{ scope: BudgetFormScope, data: ItemFormState }>
        ) => {
            const itemData = action.payload.data;
            const items = draft(state, action.payload.scope);

            items.push({
                ...itemData,
                temp_id: newTemId(),
                quotation_link_id: undefined,
                item_values: {
                    ...itemData.item_values,
                    id: undefined,
                    item_reference_id: undefined,
                    created_at: undefined,
                    position: items.length, // define a posição do item como o último índice da lista
                },
            });
        },
        reorderItems: (
            state: ItemTableState,
            action: PayloadAction<{ scope: BudgetFormScope, position: { oldIndex: number; newIndex: number } }>
        ) => {
            const items = draft(state, action.payload.scope);

            const { oldIndex, newIndex } = action.payload.position;

            if (oldIndex === newIndex) return;
            if (
                oldIndex < 0 || // index negativo
                oldIndex >= items.length || // index maior que o tamanho da lista
                newIndex < 0 || // index negativo
                newIndex >= items.length // index maior que o tamanho da lista
            ) {
                return;
            }

            const removed = items.splice(oldIndex, 1); // remove o item do oldIndex
            const moved = removed[0]; // pega o item removido
            items.splice(newIndex, 0, moved); // adiciona o item no newIndex

            // atualiza a posição de todos os itens
            items.forEach((item, index) => {
                item.item_values.position = index;
            });
        },
        deleteItem: (
            state: ItemTableState,
            action: PayloadAction<{ scope: BudgetFormScope, tempItemId: string }>
        ) => {
            const tempId = action.payload.tempItemId;
            const items = draft(state, action.payload.scope);

            const index = items.findIndex((item) => item.temp_id === tempId); // encontra o índice do item a ser deletado

            if (index !== -1) {
                items.splice(index, 1); // remove o item do estado

                // atualiza a posição de todos os itens
                items.forEach((item, index) => {
                    item.item_values.position = index;
                });
            }
        },
        editItem: (
            state: ItemTableState,
            action: PayloadAction<{ scope: BudgetFormScope, data: ItemFormState }>
        ) => {
            const items = draft(state, action.payload.scope);
            const updatedItem = action.payload.data;

            const index = items.findIndex((item) => item.temp_id === updatedItem.temp_id); // encontra o índice do item a ser atualizado

            if (index !== -1) {
                items[index] = updatedItem; // substitui o item pelo atualizado
            }
        },
        resetTable: (
            state: ItemTableState,
            action: PayloadAction<BudgetFormScope>
        ) => {
            state[action.payload] = createEmptyItemsData();
        },
        setItemTable: (
            state: ItemTableState,
            action: PayloadAction<{ scope: BudgetFormScope, data: ItemTableInput[] }>
        ) => {
            state[action.payload.scope] = action.payload.data.map((item) => ({
                ...item,
                temp_id: newTemId(),
                toggleStMode: false,
            }));
        }
    },
});

export const { addItem, reorderItems, resetTable, deleteItem, editItem, setItemTable } = itemTableSlice.actions;

export default itemTableSlice.reducer;