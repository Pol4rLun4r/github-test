/* eslint-disable @typescript-eslint/no-explicit-any */
// redux
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ItemFormState {
    toggleStMode: boolean;
    temp_id: string;
    quotation_link_id?: number;
    item_reference: Partial<ItemReference>;
    item_values: Partial<ItemValues>
    reference_links: Partial<ReferenceLink>[];
}

export type ItemFormScope = "item_form_add" | "item_form_edit" | "item_form_add_budget_edit";

export interface ItemFormSliceState {
    item_form_add: ItemFormState;
    item_form_edit: ItemFormState;
    item_form_add_budget_edit: ItemFormState;
}

export const createEmptyItemData = (): ItemFormState => {
    return {
        toggleStMode: false,
        temp_id: "",
        item_reference: {
            id: undefined,
            description: "",
            internal_code: "",
            manufacturer_code: "",
            ncm: "",
        },
        reference_links: [],
        item_values: {
            unit_price: undefined,
            quantity: 1,
            ipi: undefined,
            st: undefined,
            markup: '40',
            purchase_shipping: undefined,
            extra_value: undefined,
            boarding: 0,
            delivery: 3,
        },
    };
};

const initialState: ItemFormSliceState = {
    item_form_add: createEmptyItemData(),
    item_form_edit: createEmptyItemData(),
    item_form_add_budget_edit: createEmptyItemData()
};

const draft = (state: ItemFormSliceState, scope: ItemFormScope): ItemFormState => {
    return state[scope];
};

type SetReferenceFieldPayload<K extends keyof ItemReference> = {
    scope: ItemFormScope;
    key: K;
    value: ItemReference[K];
};

const itemReferenceReducers = {
    setReferenceField: (
        state: ItemFormSliceState,
        action: PayloadAction<SetReferenceFieldPayload<keyof ItemReference>>
    ) => {
        const { scope, key, value } = action.payload;

        const target = draft(state, scope).item_reference as any;

        target[key] = value;
    },
    setItemReference: (
        state: ItemFormSliceState,
        action: PayloadAction<{ scope: ItemFormScope; data: Partial<ItemReference> }>,
    ) => {
        draft(state, action.payload.scope).item_reference = action.payload.data;
    },
    resetItemDescription: (state: ItemFormSliceState, action: PayloadAction<ItemFormScope>) => {
        const empty = createEmptyItemData();
        const item = draft(state, action.payload).item_reference;
        item.description = empty.item_reference.description;
    },
    resetItemReference: (state: ItemFormSliceState, action: PayloadAction<ItemFormScope>) => {
        const empty = createEmptyItemData();
        const item = draft(state, action.payload);
        item.item_reference = empty.item_reference;
        item.reference_links = empty.reference_links;
    },
}

type SetValuesFieldPayload<K extends keyof ItemValues> = {
    scope: ItemFormScope;
    key: K;
    value: ItemValues[K];
};

const itemValuesReducers = {
    setValuesField: (
        state: ItemFormSliceState,
        action: PayloadAction<SetValuesFieldPayload<keyof ItemValues>>
    ) => {
        const { scope, key, value } = action.payload;

        const target = draft(state, scope).item_values as any;

        target[key] = value;
    },
    setValues: (
        state: ItemFormSliceState,
        action: PayloadAction<{ scope: ItemFormScope; values: Partial<ItemValues> }>,
    ) => {
        draft(state, action.payload.scope).item_values = action.payload.values;
    },
    switchStMode: (
        state: ItemFormSliceState,
        action: PayloadAction<{ scope: ItemFormScope; }>,
    ) => {
        const stateWithScope = draft(state, action.payload.scope);

        stateWithScope.toggleStMode = !stateWithScope.toggleStMode;
    },
    resetItemValues: (state: ItemFormSliceState, action: PayloadAction<ItemFormScope>) => {
        const empty = createEmptyItemData();
        const stateWithScope = draft(state, action.payload);

        // reseta o botão de stMode
        stateWithScope.toggleStMode = empty.toggleStMode;

        // reseta item_values
        stateWithScope.item_values = empty.item_values
    },
}

const referenceLinksReducers = {
    addLink: (
        state: ItemFormSliceState,
        action: PayloadAction<{ scope: ItemFormScope; link: Partial<ReferenceLink> }>,
    ) => {
        draft(state, action.payload.scope).reference_links.push(action.payload.link);
    },
    removeLink: (
        state: ItemFormSliceState,
        action: PayloadAction<{ scope: ItemFormScope; index: number }>,
    ) => {
        draft(state, action.payload.scope).reference_links.splice(action.payload.index, 1);
    },
    setReferenceLinks: (
        state: ItemFormSliceState,
        action: PayloadAction<{ scope: ItemFormScope; links: Partial<ReferenceLink>[] }>,
    ) => {
        draft(state, action.payload.scope).reference_links = action.payload.links;
    },
}

const itemFormSlice = createSlice({
    name: "item-form",
    initialState,
    reducers: {
        ...itemReferenceReducers,
        ...itemValuesReducers,
        ...referenceLinksReducers,
        setItemForm: (
            state,
            action: PayloadAction<{ scope: ItemFormScope; item: ItemFormState }>
        ) => {
            state[action.payload.scope] = action.payload.item;
        },
        resetItemForm: (state, action: PayloadAction<ItemFormScope>) => {
            const empty = createEmptyItemData();
            state[action.payload] = empty;
        },
    },
});

export const {
    setReferenceField,
    setItemReference,
    setReferenceLinks,
    setValuesField,
    setValues,
    resetItemReference,
    resetItemForm,
    resetItemDescription,
    resetItemValues,
    addLink,
    removeLink,
    setItemForm,
    switchStMode
} = itemFormSlice.actions;

export default itemFormSlice.reducer;