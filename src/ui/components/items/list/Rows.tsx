import { Table, TableTdProps } from "@mantine/core";

import classes from "./Items.module.css"

// component
import RowContent from "../../createBudget/items/List/RowContent.tsx";
import MenuItem from "./menu/@MenuItem.tsx";

export const Rows = ({ references }: { references: ItemReference[] }) => {
  const tableTdProps: TableTdProps = {
    className: classes.rowContainer,
    height: 40,
  }

  return (
    references.map((reference) => (
      <Table.Tr key={reference.id}>
        <Table.Td align="center">
          <MenuItem notes={reference.notes} itemReferenceId={reference.id} />
        </Table.Td>
        <Table.Td {...tableTdProps} ><RowContent label={reference.description} /></Table.Td>
        <Table.Td {...tableTdProps} ><RowContent label={reference.internal_code} /></Table.Td>
        <Table.Td {...tableTdProps} ><RowContent label={reference.manufacturer_code} /></Table.Td>
        <Table.Td {...tableTdProps} ><RowContent label={reference.ncm} /></Table.Td>
        {/* <Table.Td {...tableTdProps} >Em manutenção</Table.Td> */}
        {/* <Table.Td {...tableTdProps} >Em manutenção</Table.Td> */}
      </Table.Tr>
    ))
  )
}
