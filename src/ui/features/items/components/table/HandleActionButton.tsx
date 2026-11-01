import { useEffect } from "react";

// mantine
import { ActionIcon, Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";

// redux
import { useAppDispatch } from "@/app/reduxHooks";
import { setItem } from "../../store/itemDetails.slice";

// api
import { useLazyGetItemDetailsByReferenceIdQuery } from "../../store/items.api";

// icons
import { IconListDetails } from "@tabler/icons-react";

interface HandleActionButtonProps {
    openItemDetails: () => void;
    itemReferenceId: number;
}

const HandleActionButton = ({ openItemDetails, itemReferenceId }: HandleActionButtonProps) => {
    const dispatch = useAppDispatch();
    const [getItemDetails, { error, isFetching }] = useLazyGetItemDetailsByReferenceIdQuery();

    useEffect(() => {
        if (!error) return;

        const message = "error" in error
            ? error.error
            : error.message ?? "Não foi possível buscar os detalhes do item.";

        notifications.show({
            title: "Erro ao buscar detalhes do item",
            message,
            position: "bottom-right",
            color: "pink",
        });
    }, [error]);

    const handleClick = async () => {
        const result = await getItemDetails(itemReferenceId);
        if (result.error || !result.data) return;

        dispatch(setItem({
            itemWithReferenceLinks: result.data.item_with_reference_links,
            latestPrice: result.data.latest_price,
            records: result.data.item_values_records,
        }));

        openItemDetails();
    }

    return (
        <ActionIcon
            onClick={() => void handleClick()}
            disabled={isFetching}
            aria-label="Ver detalhes do item"
            variant="transparent"
        >
            {isFetching ? <Loader size={16} /> : <IconListDetails/>}
        </ActionIcon>
    )
}

export default HandleActionButton