// mantine
import { Paper, Stack, Text, Tooltip } from "@mantine/core";

// redux
import { useAppSelector } from "@/app/reduxHooks";

// hooks
import { useClipboard } from "@mantine/hooks";

// selectors
import { selectItemDeliveryInfo } from "@/features/budget/budgetForm/store/budgetForm.selectors";

// utils
const configPaperProps = {
    radius: "lg",
    p: "sm",
    style: {
        borderColor: "light-dark(var(--mantine-color-violet-7), var(--mantine-color-violet-3))",
        borderWidth: 2,
        borderStyle: "solid"
    },
};

const DeliveryTime = () => {
    const itemValues = useAppSelector((state) => state.items.itemValues);
    const clipboard = useClipboard({ timeout: 1000 });
    const baseDate = new Date();
    const deliveryInfo = useAppSelector((state) =>
        itemValues.id === undefined
            ? undefined
            : selectItemDeliveryInfo(state, itemValues, baseDate)
    );

    const handleCopy = () => {
        if (!deliveryInfo?.hasDeliveryDate) return;

        clipboard.copy(deliveryInfo.deliveryDate);
    };

    return (
        <Tooltip
            label={
                clipboard.copied
                    ? "Data copiada"
                    : deliveryInfo?.hasDeliveryDate
                        ? "Clique para copiar a data de entrega"
                        : "Sem embarque ou prazo de entrega"
            }
            withArrow
        >
            <Paper
                {...configPaperProps}
                onClick={handleCopy}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleCopy();
                    }
                }}
                role="button"
                tabIndex={0}
                aria-label="Copiar prazo de entrega"
                style={{ ...configPaperProps.style, cursor: "pointer" }}
            >
                <Stack gap="xs" justify="space-between" h={"100%"}>
                    <Text
                        size="0.8rem"
                        c="light-dark(var(--mantine-color-violet-7), var(--mantine-color-violet-3))"
                    >
                        Tempo de entrega
                    </Text>
                    <Text
                        size="0.8rem"
                        c="light-dark(var(--mantine-color-violet-9), var(--mantine-color-violet-1))"
                    >
                        {deliveryInfo?.deliveryDateLabel ?? "—"}
                    </Text>
                </Stack>
            </Paper>
        </Tooltip>
    )
}

export default DeliveryTime;