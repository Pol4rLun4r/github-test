// mantine
import { Table, TableTdProps } from "@mantine/core";

// redux
import { useSelector } from 'react-redux';
import { RootState } from "../../../../../redux/store.ts";

// components
import RowContent from "../../../../createBudget/items/List/RowContent.tsx";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

// style
import classes from '../../Items.module.css';

// utils
import calcAddItem from "../../../../../utils/calcAddItem.ts";
import { convertMarkupValue } from "../../../../../utils/markupList.ts";

const tableTdProps: TableTdProps = {
  className: classes.rowContainer,
  height: 40,
}

const Row = ({ item_version }: { item_version: ItemVersion }) => {
  const switchMode = useSelector((state: RootState) => state.createBudget.listItemsSwitchMode.mode);

  const values = item_version;

  const calcItem = calcAddItem(values);

  const unitValue = calcItem.finalUnitValue;
  const total = calcItem.totalWithAll;

  return (
    <Table.Tr >
      <Table.Td {...tableTdProps}><RowContent label={brl.format(unitValue)} /></Table.Td>
      <Table.Td {...tableTdProps}><RowContent label={item_version.quantity} /></Table.Td>
      <Table.Td {...tableTdProps}><RowContent label={brl.format(total)} /></Table.Td>
      <Table.Td {...tableTdProps}><RowContent extraText="Embarque:" label={item_version.boarding} /></Table.Td>
      <Table.Td {...tableTdProps}><RowContent label={convertMarkupValue(item_version.markup) + "%"} /></Table.Td>
      {!switchMode &&
        <>
          <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.totalWithoutTaxes)} /></Table.Td>
          <Table.Td {...tableTdProps}><RowContent label={brl.format(item_version.unit_price as number)} /></Table.Td>
          <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.markupUnitValue)} /></Table.Td>
          <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.markupValue)} /></Table.Td>
          <Table.Td {...tableTdProps}><RowContent label={brl.format(!item_version.st ? 0 : item_version.st)} /></Table.Td>
          <Table.Td {...tableTdProps}><RowContent label={(!item_version.ipi ? 0 : item_version.ipi) + "%"} /></Table.Td>
          <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.ipiValue)} /></Table.Td>
          <Table.Td {...tableTdProps}><RowContent label={brl.format(!item_version.purchase_shipping ? 0 : item_version.purchase_shipping)} /></Table.Td>
          <Table.Td {...tableTdProps}><RowContent label={brl.format(!item_version.extra_value ? 0 : item_version.extra_value)} /></Table.Td>
          <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.totalWithIPIandST)} /></Table.Td>
        </>
      }
    </Table.Tr>
  )
}

export default Row