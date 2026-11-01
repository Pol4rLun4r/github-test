// mantine
import { DataList } from "@mantine/core";

// redux
import { useAppSelector } from "@/app/reduxHooks";

// utils
import { convertMarkupValue } from "@/utils/markupList";

const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

const formatCurrency = (value?: number) =>
    value !== undefined && Number.isFinite(value) ? brl.format(value) : "—";

const PriceComposition = () => {
    const itemValues = useAppSelector((state) => state.items.itemValues);
    const data = [
        { field: "Preço unitário", value: formatCurrency(itemValues.unit_price) },
        { field: "Quantidade", value: itemValues.quantity?.toLocaleString("pt-BR") ?? "—" },
        { field: "IPI", value: itemValues.ipi === undefined || itemValues.ipi === null ? "—" : `${itemValues.ipi}%` },
        { field: "ST", value: itemValues.st?.toLocaleString("pt-BR") ?? "—" },
        { field: "Markup", value: itemValues.markup === undefined ? "—" : `${convertMarkupValue(itemValues.markup)}%` },
        { field: "Valor extra", value: formatCurrency(itemValues.extra_value) },
        { field: "Frete de compra", value: formatCurrency(itemValues.purchase_shipping) },
        { field: "Embarque", value: itemValues.boarding?.toLocaleString("pt-BR") ?? "—" },
        { field: "Entrega", value: itemValues.delivery?.toLocaleString("pt-BR") ?? "—" },
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

export default PriceComposition;