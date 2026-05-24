// redux
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { ItemDataState } from "./itemFormSlice";

const initialState: ItemDataState[] = [];

function newTemId(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return `item-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

const listItemsSlice = createSlice({
    name: "list-items",
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<ItemDataState>) => {
            state.push({
                ...action.payload,
                temp_id: newTemId(),
                item_version: {
                    ...action.payload.item_version,
                    position: state.length, // define a posição do item como o último índice da lista
                }
            });
        },
        reorderItems: (
            state,
            action: PayloadAction<{ oldIndex: number; newIndex: number }>
        ) => {
            const { oldIndex, newIndex } = action.payload;

            if (oldIndex === newIndex) return;
            if (
                oldIndex < 0 || // index negativo
                oldIndex >= state.length || // index maior que o tamanho da lista
                newIndex < 0 || // index negativo
                newIndex >= state.length // index maior que o tamanho da lista
            ) {
                return;
            }

            const removed = state.splice(oldIndex, 1); // remove o item do oldIndex
            const moved = removed[0]; // pega o item removido
            state.splice(newIndex, 0, moved); // adiciona o item no newIndex

            // atualiza a posição de todos os itens
            state.forEach((item, index) => {
                item.item_version.position = index;
            });
        },
        deleteItem: (state, action: PayloadAction<string>) => {
            const tempId = action.payload;
            const index = state.findIndex((item) => item.temp_id === tempId); // encontra o índice do item a ser deletado

            if (index !== -1) {
                state.splice(index, 1); // remove o item do estado

                // atualiza a posição de todos os itens
                state.forEach((item, index) => {
                    item.item_version.position = index;
                });
            }
        },
        editItem: (state, action: PayloadAction<ItemDataState>) => {
            const updatedItem = action.payload;
            const index = state.findIndex((item) => item.temp_id === updatedItem.temp_id); // encontra o índice do item a ser atualizado

            if (index !== -1) {
                state[index] = updatedItem; // substitui o item pelo atualizado
            }
        },
        resetList: () => initialState,
    },
});

export const { addItem, reorderItems, resetList, deleteItem, editItem } = listItemsSlice.actions;

export default listItemsSlice.reducer;