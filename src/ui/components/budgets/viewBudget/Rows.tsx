// redux
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store.ts";

// utils
import calcAddItem from "../../../utils/calcAddItem.ts";
import { convertMarkupValue } from "../../../utils/markupList.ts";

// mantine
import { Table, TableTdProps } from "@mantine/core";

// components
import RowContent from "./RowContent.tsx";

const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
})

const tableTdProps: TableTdProps = {
    style: { overflow: 'hidden', verticalAlign: 'middle' },
    height: 40,
}


const Rows = ({ item }: { item: QuotationDetailLine }) => {
    const switchMode = useSelector((state: RootState) => state.createBudget.listItemsSwitchMode.mode)

    const itemVersion = item.item_version;
    const itemReference = item.item_reference;

    const calcItem = calcAddItem(itemVersion);

    const unitValue = calcItem.finalUnitValue;
    const total = calcItem.totalWithAll;

    return (
        <Table.Tr>
            <Table.Td {...tableTdProps}>{itemVersion?.position + 1}</Table.Td>
            <Table.Td {...tableTdProps}><RowContent disableCopyButton label={itemReference.description} /></Table.Td>
            <Table.Td {...tableTdProps}><RowContent label={brl.format(unitValue)} /></Table.Td>
            <Table.Td {...tableTdProps}><RowContent label={itemVersion.quantity} /></Table.Td>
            <Table.Td {...tableTdProps}><RowContent label={brl.format(total)} /></Table.Td>
            <Table.Td {...tableTdProps}><RowContent label={itemReference.internal_code} /></Table.Td>
            <Table.Td {...tableTdProps}><RowContent extraText="Embarque:" label={itemVersion.boarding} /></Table.Td>
            <Table.Td {...tableTdProps}><RowContent label={convertMarkupValue(itemVersion.markup) + "%"} /></Table.Td>
            {!switchMode &&
                <>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.totalWithoutTaxes)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(itemVersion.unit_price as number)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.markupUnitValue)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.markupValue)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(!itemVersion.st ? 0 : itemVersion.st)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={(!itemVersion.ipi ? 0 : itemVersion.ipi) + "%"} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.ipiValue)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(!itemVersion.purchase_shipping ? 0 : itemVersion.purchase_shipping)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(!itemVersion.extra_value ? 0 : itemVersion.extra_value)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.totalWithIPIandST)} /></Table.Td>
                </>
            }
        </Table.Tr>
    )
}

export default Rows