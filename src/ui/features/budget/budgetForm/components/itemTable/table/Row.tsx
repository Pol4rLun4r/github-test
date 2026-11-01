/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
// mantine
import { Table, TableTdProps } from "@mantine/core"

// redux
import { ItemFormState } from "@/features/budget/itemForm/store/itemForm.slice";
import { selectItemDeliveryInfo } from "@/features/budget/budgetForm/store/budgetForm.selectors";

// DragAndDrop
import { useSortable } from "@dnd-kit/react/sortable";

// utils
import calcAddItem from "@/utils/calcAddItem";
import { convertMarkupValue } from "@/utils/markupList";

// components
import RowContent from "@/shared/RowContent/RowContent";

// style
import classes from './Row.module.css';
import { useAppSelector } from "@/app/reduxHooks";

const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
})

const tableTdProps: TableTdProps = {
    className: classes.rowContainer,
    height: 40,
}

interface RowProps {
    item: ItemFormState;
    index: number;
}

const Row = ({ item, index }: RowProps) => {
    const { ref } = useSortable({ id: item.temp_id, index })
    const switchMode = useAppSelector((state) => state.budgetForm.itemTableSwitch.mode)

    const values = item.item_values;

    const calcItem = calcAddItem(values);

    const unitValue = calcItem.finalUnitValue;
    const total = calcItem.totalWithAll;

    const baseDate = new Date();
    const { deliveryDateLabel, deliveryDate, hasDeliveryDate } = useAppSelector(
        (state) => selectItemDeliveryInfo(state, item.item_values as ItemValues, baseDate)
    );

    return (
        <Table.Tr ref={ref} data-item-id={item.temp_id}>
                <Table.Td {...tableTdProps}>{item.item_values?.position! + 1}</Table.Td>
                <Table.Td {...tableTdProps}><RowContent disableCopyButton label={item.item_reference.description} /></Table.Td>
                <Table.Td {...tableTdProps}><RowContent label={item.item_reference.internal_code} /></Table.Td>
                <Table.Td {...tableTdProps}><RowContent onlyNumbers label={brl.format(unitValue)} /></Table.Td>
                <Table.Td {...tableTdProps}><RowContent label={item.item_values.quantity} /></Table.Td>
                <Table.Td {...tableTdProps}><RowContent onlyNumbers label={brl.format(total)} /></Table.Td>
                <Table.Td {...tableTdProps}>
                    <RowContent
                        label={deliveryDateLabel}
                        value={hasDeliveryDate ? deliveryDate : ''}
                    />
                </Table.Td>
                <Table.Td {...tableTdProps}><RowContent label={convertMarkupValue(item.item_values.markup) + "%"} /></Table.Td>
                {!switchMode &&
                    <>
                        <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.totalWithoutTaxes)} /></Table.Td>
                        <Table.Td {...tableTdProps}><RowContent onlyNumbers label={brl.format(unitValue)}  /></Table.Td>
                        <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.markupUnitValue)} /></Table.Td>
                        <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.markupValue)} /></Table.Td>
                        <Table.Td {...tableTdProps}><RowContent label={brl.format(!item.item_values.st ? 0 : item.item_values.st)} /></Table.Td>
                        <Table.Td {...tableTdProps}><RowContent label={(!item.item_values.ipi ? 0 : item.item_values.ipi) + "%"} /></Table.Td>
                        <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.ipiValue)} /></Table.Td>
                        <Table.Td {...tableTdProps}><RowContent label={brl.format(!item.item_values.purchase_shipping ? 0 : item.item_values.purchase_shipping)} /></Table.Td>
                        <Table.Td {...tableTdProps}><RowContent label={brl.format(!item.item_values.extra_value ? 0 : item.item_values.extra_value)} /></Table.Td>
                        <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.totalWithIPIandST)} /></Table.Td>
                    </>
                }
        </Table.Tr>
    )
}

export default Row;