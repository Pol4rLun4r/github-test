// mantine
import { useEffect, useRef } from "react";

import { skipToken } from "@reduxjs/toolkit/query";
import { Loader, Paper, Table as MantineTable, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";

// api
import {
    useGetAllItemValuesByReferenceIdQuery,
    useLazyGetItemValuesByIdQuery,
} from "@/features/items/store/items.api";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { resetItemValues, setItemValues } from "@/features/items/store/ItemValues.slice";

// components
import Row from "./Row";

interface TableProps {
    itemReferenceId: ItemReference["id"];
}

const Table = ({ itemReferenceId }: TableProps) => {
    const dispatch = useAppDispatch();
    const selectedItemValuesId = useAppSelector((state) => state.items.itemValues.id);
    const [getItemValuesById] = useLazyGetItemValuesByIdQuery();
    const latestRequest = useRef(0);
    const {
        currentData: itemValues,
        error,
        isFetching,
    } = useGetAllItemValuesByReferenceIdQuery(itemReferenceId ?? skipToken);

    useEffect(() => {
        latestRequest.current += 1;
        dispatch(resetItemValues());

        return () => {
            latestRequest.current += 1;
        };
    }, [dispatch, itemReferenceId]);

    const handleSelect = async (item: ItemValues) => {
        dispatch(setItemValues(item));
        const requestId = ++latestRequest.current;

        try {
            const values = await getItemValuesById(item.id).unwrap();
            if (requestId === latestRequest.current) {
                dispatch(setItemValues(values));
            }
        } catch (requestError) {
            if (requestId !== latestRequest.current) return;

            const message = typeof requestError === "object"
                && requestError !== null
                && "error" in requestError
                && typeof requestError.error === "string"
                ? requestError.error
                : "Não foi possível carregar os detalhes deste registro.";

            notifications.show({
                title: "Erro ao buscar valores do item",
                message,
                position: "bottom-right",
                color: "pink",
            });
        }
    };

    useEffect(() => {
        if (!error) return;

        const message = "error" in error
            ? error.error
            : error.message ?? "Não foi possível buscar o histórico de valores.";

        notifications.show({
            title: "Erro ao buscar histórico de valores",
            message,
            position: "bottom-right",
            color: "pink",
        });
    }, [error]);

    return (
        <Paper withBorder>
            <MantineTable highlightOnHover layout="fixed">
                <MantineTable.Thead>
                    <MantineTable.Tr>
                        <MantineTable.Th>Preço final</MantineTable.Th>
                        <MantineTable.Th>Markup (%)</MantineTable.Th>
                        <MantineTable.Th>Criado</MantineTable.Th>
                    </MantineTable.Tr>
                </MantineTable.Thead>
                <MantineTable.Tbody>
                    {Array.from({ length: 5 }, (_, index) => {
                        const item = itemValues?.[index];
                        if (item) {
                            return (
                                <Row
                                    key={item.id ?? `${item.item_reference_id}-${index}`}
                                    item={item}
                                    selected={item.id !== undefined && item.id === selectedItemValuesId}
                                    onSelect={handleSelect}
                                />
                            );
                        }

                        const isFirstEmptyRow = index === 0 && !itemValues?.length;

                        return (
                            <MantineTable.Tr key={`empty-${index}`} style={{ height: 42 }}>
                                {isFirstEmptyRow ? (
                                    <MantineTable.Td colSpan={3} align="center">
                                        {isFetching ? (
                                            <Loader size="sm" />
                                        ) : (
                                            <Text c="dimmed">
                                                {error
                                                    ? "Não foi possível carregar o histórico."
                                                    : "Nenhum registro de valores encontrado."}
                                            </Text>
                                        )}
                                    </MantineTable.Td>
                                ) : (
                                    <>
                                        <MantineTable.Td />
                                        <MantineTable.Td />
                                        <MantineTable.Td />
                                    </>
                                )}
                            </MantineTable.Tr>
                        );
                    })}
                </MantineTable.Tbody>
            </MantineTable>
        </Paper>
    )
}

export default Table