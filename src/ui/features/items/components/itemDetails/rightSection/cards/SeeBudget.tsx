// mantine
import { Group, Loader, Paper, Text } from "@mantine/core";
import { IconEye } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { setOriginalBudget } from "@/features/budget/budgetForm/store/originalBudgetSlice";
import { setItemTable } from "@/features/budget/budgetForm/store/itemTable.slice";
import { setQuotation } from "@/features/budget/budgetForm/store/quotationInfo.slice";
import { useLazyGetQuotationByItemValuesIdQuery } from "@/features/budget/budgetForm/store/quotation.api";

const configPaperProps = {
    radius: "lg",
    p: "sm",
    style: {
        borderColor: "light-dark(var(--mantine-color-violet-7), var(--mantine-color-violet-3))",
        borderWidth: 2,
        borderStyle: "solid"
    },
};

interface SeeBudgetProps {
    onViewBudget: () => void;
}

const SeeBudget = ({ onViewBudget }: SeeBudgetProps) => {
    const dispatch = useAppDispatch();
    const itemValuesId = useAppSelector((state) => state.items.itemValues.id);
    const [getQuotation, { isFetching }] = useLazyGetQuotationByItemValuesIdQuery();

    const handleViewBudget = async () => {
        if (itemValuesId === undefined || isFetching) return;

        dispatch(setOriginalBudget(null));

        try {
            const quotation = await getQuotation(itemValuesId).unwrap();
            const items = quotation.items.map((item) => ({
                ...item,
                temp_id: "",
                toggleStMode: false,
            }));

            dispatch(setItemTable({ scope: "budget_form_edit", data: items }));
            dispatch(setQuotation({ scope: "budget_form_edit", data: quotation.quotation }));
            dispatch(setOriginalBudget({ quotation: quotation.quotation, items }));
            onViewBudget();
        } catch (error) {
            let message = "Não foi possível carregar o orçamento deste registro.";
            if (error instanceof Error) {
                message = error.message;
            } else if (typeof error === "string") {
                message = error;
            } else if (typeof error === "object" && error !== null) {
                if ("error" in error && typeof error.error === "string") {
                    message = error.error;
                } else if ("message" in error && typeof error.message === "string") {
                    message = error.message;
                }
            }

            notifications.show({
                title: "Erro ao abrir orçamento",
                message,
                position: "bottom-right",
                color: "pink",
            });
        }
    };

    const disabled = itemValuesId === undefined || isFetching;

    return (
        <Paper
            {...configPaperProps}
            component="button"
            type="button"
            disabled={disabled}
            onClick={() => void handleViewBudget()}
            aria-label="Ver orçamento"
            style={{
                ...configPaperProps.style,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.5 : undefined,
                background: "transparent",
            }}
        >
            <Group gap={5}>
                {isFetching
                    ? <Loader size={16} color="violet" />
                    : <IconEye color="light-dark(var(--mantine-color-violet-9), var(--mantine-color-violet-1))" />}
                <Text
                    size="0.8rem"
                    c="light-dark(var(--mantine-color-violet-9), var(--mantine-color-violet-1))"
                >
                    Ver orçamento
                </Text>
            </Group>
        </Paper>
    )
}

export default SeeBudget