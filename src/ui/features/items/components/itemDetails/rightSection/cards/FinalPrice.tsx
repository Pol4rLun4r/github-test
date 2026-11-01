// mantine
import { Paper, Stack, Text, Tooltip } from "@mantine/core";

// redux
import { useAppSelector } from "@/app/reduxHooks";

// hooks
import { useClipboard } from "@mantine/hooks";

// utils
import calcAddItem from "@/utils/calcAddItem";

const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

const formatCurrency = (value?: number) =>
    value !== undefined && Number.isFinite(value) ? brl.format(value) : "—";

const configPaperProps = {
    radius: "lg",
    p: "sm",
    style: {
        borderColor: "light-dark(var(--mantine-color-violet-7), var(--mantine-color-violet-3))",
        borderWidth: 2,
        borderStyle: "solid"
    },
};

const FinalPrice = () => {
    const itemValues = useAppSelector((state) => state.items.itemValues);
    const clipboard = useClipboard({ timeout: 1000 });
    const hasSelection = itemValues.id !== undefined;
    const finalUnitValue =
        hasSelection && itemValues.quantity !== undefined && itemValues.quantity > 0
            ? calcAddItem(itemValues).finalUnitValue
            : undefined;

    const handleCopy = () => {
        if (finalUnitValue === undefined || !Number.isFinite(finalUnitValue)) return;

        clipboard.copy(finalUnitValue.toFixed(2).replace(".", ","));
    };

    return (
        <Tooltip label={clipboard.copied ? "Valor copiado" : "Clique para copiar o valor"} withArrow>
            <Paper
                {...configPaperProps}                
                flex={1} 
                
                onClick={handleCopy}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleCopy();
                    }
                }}
                role="button"
                tabIndex={0}
                aria-label="Copiar preço final"
                style={{ ...configPaperProps.style, cursor: "pointer" }}
            >
                <Stack gap="xs" justify="space-between" h={"100%"}>
                    <Text c="light-dark(var(--mantine-color-violet-7), var(--mantine-color-violet-3))">
                        Preço final
                    </Text>
                    <Text
                        size="1.5rem"
                        c="light-dark(var(--mantine-color-violet-9), var(--mantine-color-violet-1))"
                    >
                        {formatCurrency(finalUnitValue)}
                    </Text>
                    <Text
                        c="light-dark(var(--mantine-color-violet-7), var(--mantine-color-violet-3))"
                        size="1rem"
                    >
                        {hasSelection
                            ? `Registrado em ${itemValues.created_at ?? "—"}`
                            : "Selecione um registro do histórico"}
                    </Text>
                </Stack>
            </Paper>
        </Tooltip>
    )
}

export default FinalPrice