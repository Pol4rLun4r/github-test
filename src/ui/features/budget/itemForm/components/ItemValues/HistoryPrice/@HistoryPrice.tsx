// redux
import { useAppSelector } from "@/app/reduxHooks"
import { isHasItemReferenceId } from "../../../store/itemForm.selectors"

// mantine
import { ActionIcon, FloatingWindow } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useState } from "react"
import { skipToken } from "@reduxjs/toolkit/query"

// icons
import { IconHistory } from "@tabler/icons-react"
import { ItemFormScope } from "../../../store/itemForm.slice"

// components
import Table from './table/@Table';

// api
import { useGetAllItemValuesByReferenceIdQuery } from "@/features/items/store/items.api";

interface HistoryPriceProps {
    scope: ItemFormScope
}

const HistoryPrice = ({ scope }: HistoryPriceProps) => {
    const [visible, handlers] = useDisclosure();
    const [initialPosition, setInitialPosition] = useState<{ top: number; left: number }>();

    const hasItemId = useAppSelector((state) => isHasItemReferenceId(state, scope))
    const itemReferenceId = useAppSelector((state) => state.itemForm.form[scope].item_reference.id);
    const {
        currentData: itemValues,
        error,
        isFetching,
    } = useGetAllItemValuesByReferenceIdQuery(itemReferenceId ?? skipToken);
    const errorMessage = error
        ? "error" in error
            ? error.error
            : error.message ?? "Não foi possível buscar o histórico de valores."
        : undefined;

    const floatingWindowWidth: number = 420; 

    return (
        <>
            <ActionIcon
                size={"input-sm"}
                variant="light"
                radius={"lg"}
                disabled={!hasItemId}
                onClick={(event) => {
                    if (visible) {
                        handlers.close();
                        return;
                    }

                    const buttonRect = event.currentTarget.getBoundingClientRect();
                    setInitialPosition({
                        top: buttonRect.top + 50,
                        left: buttonRect.right + -(floatingWindowWidth / 2),
                    });

                    handlers.open();
                }}
            >
                <IconHistory />
            </ActionIcon>
            {visible && (
                <FloatingWindow
                    w={floatingWindowWidth}
                    p="md"
                    withBorder
                    excludeDragHandleSelector="button"
                    initialPosition={initialPosition}
                    constrainToViewport
                    style={{ cursor: 'move' }}
                >
                    <Table
                        scope={scope}
                        itemValues={itemValues ?? []}
                        isFetching={isFetching}
                        errorMessage={errorMessage}

                        handlers={handlers}
                    />
                </FloatingWindow>
            )}

        </>

    )
}

export default HistoryPrice