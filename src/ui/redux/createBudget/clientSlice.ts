// redux
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ClientState extends Client {
    clearClientTrigger?: number;
}

const initialState: ClientState = {
    id: undefined,
    name: "",
    document: "",
    notes: undefined,
    type_client: "nacional",
    clearClientTrigger: 0
};

const clientSlice = createSlice({
    name: "create-budget-client",
    initialState,
    reducers: {
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        setDocument: (state, action: PayloadAction<string>) => {
            state.document = action.payload;
        },
        setNotes: (state, action: PayloadAction<string>) => {
            state.notes = action.payload;
        },
        setClient: (_state, action: PayloadAction<ClientState>) => action.payload,
        resetClient: () => initialState,
        triggerClearClient: (state) => {
            state.clearClientTrigger! += 1;
        },
        resetClearClientTrigger: (state) => {
            state.clearClientTrigger = 0;
        }
    }
});

export const { resetClient, setClient, setDocument, setName, setNotes, triggerClearClient, resetClearClientTrigger } = clientSlice.actions;

export default clientSlice.reducer;

