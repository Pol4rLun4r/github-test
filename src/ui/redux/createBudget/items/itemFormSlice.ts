/* eslint-disable @typescript-eslint/no-explicit-any */
// redux
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ItemDataState {
    temp_id: string;
    item_reference: Partial<ItemReference>;
    item_version: Partial<ItemVersion>;
    reference_links: Partial<ReferenceLink>[];
}

export type ItemFormScope = "add" | "edit";

export const ITEM_FORM_ADD: ItemFormScope = "add";
export const ITEM_FORM_EDIT: ItemFormScope = "edit";

export interface ItemFormSliceState {
    add: ItemDataState;
    edit: ItemDataState;
}

export const createEmptyItemData = (): ItemDataState => {
    return {
        temp_id: "",
        item_reference: {
            id: undefined,
            description: "",
            internal_code: "",
            manufacturer_code: "",
            ncm: "",
        },
        reference_links: [],
        item_version: {
            unit_price: undefined,
            quantity: 1,
            ipi: undefined,
            st: undefined,
            markup: "40.3",
            purchase_shipping: undefined,
            extra_value: undefined,
            boarding: ""
        },
    };
};

const initialState: ItemFormSliceState = {
    add: createEmptyItemData(),
    edit: createEmptyItemData(),
};

const draft = (state: ItemFormSliceState, scope: ItemFormScope): ItemDataState => {
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

type SetVersionFieldPayload<K extends keyof ItemVersion> = {
    scope: ItemFormScope;
    key: K;
    value: ItemVersion[K];
};

const itemVersionReducers = {
    setVersionField: (
        state: ItemFormSliceState,
        action: PayloadAction<SetVersionFieldPayload<keyof ItemVersion>>
    ) => {
        const { scope, key, value } = action.payload;

        const target = draft(state, scope).item_version as any;

        target[key] = value;
    },
    setVersion: (
        state: ItemFormSliceState,
        action: PayloadAction<{ scope: ItemFormScope; version: Partial<ItemVersion> }>,
    ) => {
        draft(state, action.payload.scope).item_version = action.payload.version;
    },
    resetItemVersion: (state: ItemFormSliceState, action: PayloadAction<ItemFormScope>) => {
        const empty = createEmptyItemData();
        const values = draft(state, action.payload).item_version;
        values.unit_price = empty.item_version.unit_price;
        values.quantity = 1;
        values.ipi = empty.item_version.ipi;
        values.st = empty.item_version.st;
        values.markup = empty.item_version.markup;
        values.purchase_shipping = empty.item_version.purchase_shipping;
        values.boarding = empty.item_version.boarding;
        values.extra_value = empty.item_version.extra_value;
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
        ...itemVersionReducers,
        ...referenceLinksReducers,
        setItemDataEdit: (
            state,
            action: PayloadAction<ItemDataState>,
        ) => {
            state.edit = action.payload;
        },
        resetItemData: (state, action: PayloadAction<ItemFormScope>) => {
            const empty = createEmptyItemData();
            state[action.payload] = empty;
        },
    },
});

export const {
    setReferenceField,
    setItemReference,
    setReferenceLinks,
    setVersionField,
    setVersion,
    resetItemReference,
    resetItemData,
    resetItemDescription,
    resetItemVersion,
    addLink,
    removeLink,
    setItemDataEdit,
} = itemFormSlice.actions;

export default itemFormSlice.reducer;