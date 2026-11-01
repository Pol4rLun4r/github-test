import { api } from "@/app/api";

export const itemsApi = api.injectEndpoints({
    endpoints: (build) => ({
        findItemReferences: build.query<ItemReference[] | undefined, SearchItemDescriptionIsOptional>({
            async queryFn(query) {
                const result = await window.api.item.findItemReferences(query);

                if (!result.success) {
                    return {
                        error: {
                            status: "CUSTOM_ERROR",
                            error: result.data,
                            code: result.code,
                        },
                    };
                }

                return { data: result.data };
            },
            providesTags: ["Items"],
        }),
        getItemDetailsByReferenceId: build.query<ItemDetails | undefined, GetByReferenceId>({
            async queryFn(itemReferenceId) {
                const result = await window.api.item.getDetailsByReferenceId(itemReferenceId);

                if (!result.success) {
                    return {
                        error: {
                            status: "CUSTOM_ERROR",
                            error: result.data,
                            code: result.code,
                        },
                    };
                }

                return { data: result.data };
            },
            providesTags: ["Items"],
        }),
        updateItemReference: build.mutation<
            ItemWithReferenceLinks | undefined,
            UpdateItemReferencePayload
        >({
            async queryFn(payload) {
                const result = await window.api.item.updateReference(payload);

                if (!result.success) {
                    return {
                        error: {
                            status: "CUSTOM_ERROR",
                            error: result.data,
                            code: result.code,
                        },
                    };
                }

                return { data: result.data };
            },
            invalidatesTags: ["Items"],
        }),
        getAllItemValuesByReferenceId: build.query<ItemValues[] | undefined, GetByReferenceId>({
            async queryFn(itemReferenceId) {
                const result = await window.api.item.getAllValuesByReferenceId(itemReferenceId);

                if (!result.success) {
                    return {
                        error: {
                            status: "CUSTOM_ERROR",
                            error: result.data,
                            code: result.code,
                        },
                    };
                }

                return { data: result.data };
            },
            providesTags: ["Items"],
        }),
        getItemValuesById: build.query<ItemValues, ItemValues["id"]>({
            async queryFn(itemValuesId) {
                const result = await window.api.item.getValuesById(itemValuesId);

                if (!result.success) {
                    return {
                        error: {
                            status: "CUSTOM_ERROR",
                            error: result.data,
                            code: result.code,
                        },
                    };
                }

                return { data: result.data };
            },
            providesTags: ["Items"],
        }),
    }),
});

export const {
    useFindItemReferencesQuery,
    useGetItemDetailsByReferenceIdQuery,
    useLazyGetItemDetailsByReferenceIdQuery,
    useUpdateItemReferenceMutation,
    useGetAllItemValuesByReferenceIdQuery,
    useLazyGetItemValuesByIdQuery,
} = itemsApi;
