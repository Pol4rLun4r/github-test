/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
// mantine
import { Table, TableTdProps } from "@mantine/core"

// redux
import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";
import { ItemDataState } from "../../../../redux/createBudget/items/itemFormSlice";

// DragAndDrop
import { useSortable } from "@dnd-kit/react/sortable";

// utils
import calcAddItem from '../../../../utils/calcAddItem';
import { convertMarkupValue } from "../../../../utils/markupList";

// components
import RowContent from "./RowContent";
import MenuItem from "./MenuItem";

// style
import classes from './Row.module.css';

const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
})

const tableTdProps: TableTdProps = {
    className: classes.rowContainer,
    height: 40,
}

interface SortableRowProps {
    item: ItemDataState;
    index: number;
}

const SortableRow = ({ item, index }: SortableRowProps) => {
    const { ref } = useSortable({ id: item.temp_id, index })
    const switchMode = useSelector((state: RootState) => state.createBudget.listItemsSwitchMode.mode)

    const values = item.item_version;

    const calcItem = calcAddItem(values);

    const unitValue = calcItem.finalUnitValue;
    const total = calcItem.totalWithAll;

    return (
        <Table.Tr ref={ref}>
            <Table.Td {...tableTdProps} align="center">
                <MenuItem item={item} />
            </Table.Td>
            <Table.Td {...tableTdProps}>{item.item_version?.position! + 1}</Table.Td>
            <Table.Td {...tableTdProps}><RowContent disableCopyButton label={item.item_reference.description} /></Table.Td>
            <Table.Td {...tableTdProps}><RowContent label={brl.format(unitValue)} /></Table.Td>
            <Table.Td {...tableTdProps}><RowContent label={item.item_version.quantity} /></Table.Td>
            <Table.Td {...tableTdProps}><RowContent label={brl.format(total)} /></Table.Td>
            <Table.Td {...tableTdProps}><RowContent label={item.item_reference.internal_code} /></Table.Td>
            <Table.Td {...tableTdProps}><RowContent extraText="Embarque:" label={item.item_version.boarding} /></Table.Td>
            <Table.Td {...tableTdProps}><RowContent label={convertMarkupValue(item.item_version.markup) + "%"} /></Table.Td>
            {!switchMode &&
                <>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.totalWithoutTaxes)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(item.item_version.unit_price as number)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.markupUnitValue)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.markupValue)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(!item.item_version.st ? 0 : item.item_version.st)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={(!item.item_version.ipi ? 0 : item.item_version.ipi) + "%"} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.ipiValue)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(!item.item_version.purchase_shipping ? 0 : item.item_version.purchase_shipping)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(!item.item_version.extra_value ? 0 : item.item_version.extra_value)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.totalWithIPIandST)} /></Table.Td>
                </>
            }
        </Table.Tr>
    )
}

export default SortableRow;