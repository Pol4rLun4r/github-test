import { api } from "@/app/api";

export const itemReference = api.injectEndpoints({
    endpoints: (build) => ({
        searchItemDescription: build.query<ItemReference[] | undefined, SearchItemDescription>({
            async queryFn(description) {
                const result = await window.api.item.searchDescription(description.trim());

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
            }
        }),
        getReferenceLinks: build.query<ReferenceLink[] | undefined, GetReferenceLinks>({
            async queryFn(itemReferenceId) {
                const result = await window.api.item.getReferenceLinks(itemReferenceId);

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
        }),
    })
});

export const {
    useSearchItemDescriptionQuery,
    useLazySearchItemDescriptionQuery,
    useLazyGetReferenceLinksQuery,
} = itemReference;