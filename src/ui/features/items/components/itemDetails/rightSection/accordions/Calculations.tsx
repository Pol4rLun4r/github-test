// mantine
import { DataList } from "@mantine/core";

// redux
import { useAppSelector } from "@/app/reduxHooks";

// utils
import calcAddItem from "@/utils/calcAddItem";

const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

const formatCurrency = (value: number, hasSelection: boolean) =>
    hasSelection && Number.isFinite(value) ? brl.format(value) : "—";

const Calculations = () => {
    const itemValues = useAppSelector((state) => state.items.itemValues);
    const hasSelection = itemValues.id !== undefined;
    const calculations = calcAddItem(itemValues);
    const data = [
        { field: "Total sem impostos", value: formatCurrency(calculations.totalWithoutTaxes, hasSelection) },
        { field: "Valor do markup em R$", value: formatCurrency(calculations.markupValue, hasSelection) },
        { field: "Valor do IPI", value: formatCurrency(calculations.ipiValue, hasSelection) },
        { field: "Valor do ST", value: formatCurrency(calculations.stValue, hasSelection) },
        { field: "Valor total + IPI e ST", value: formatCurrency(calculations.totalWithIPIandST, hasSelection) },
        { field: "Total geral com impostos + Frete + Valor extra", value: formatCurrency(calculations.totalWithAll, hasSelection) },
        { field: "Valor unitário final", value: formatCurrency(calculations.finalUnitValue, hasSelection) },
    ];

    return (
        <DataList
            orientation="horizontal"
            w="100%"
            style={{ minWidth: 0, maxWidth: "100%", overflowWrap: "anywhere" }}
        >
            {data.map((item) => (
                <DataList.Item key={item.field}>
                    <DataList.ItemLabel>{item.field}</DataList.ItemLabel>
                    <DataList.ItemValue>{item.value}</DataList.ItemValue>
                </DataList.Item>
            ))}
        </DataList>

    )
};

export default Calculations;