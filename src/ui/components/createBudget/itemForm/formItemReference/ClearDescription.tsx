// mantine
import { ActionIcon } from "@mantine/core"

// icon
import { IconX } from "@tabler/icons-react";

// redux
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../redux/store";
import {
    type ItemFormScope,
    resetItemReference,
    resetItemDescription,
} from "../../../../redux/createBudget/items/itemFormSlice";

const ClearDescription = ({ scope }: { scope: ItemFormScope }) => {
    const dispatch = useDispatch<AppDispatch>();
    const isHasId = useSelector((state: RootState) => state.createBudget.itemForm[scope].item_reference.id);

    const handleClear = () => {
        if (isHasId) {
            return dispatch(resetItemReference(scope));
        }

        dispatch(resetItemDescription(scope));
    };

    return (
        <ActionIcon variant="transparent" onClick={() => handleClear()}>
            <IconX size={15} />
        </ActionIcon>
    )
}

export default ClearDescription;