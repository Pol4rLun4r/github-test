// mantine
import { Table, TableTdProps } from "@mantine/core";

// style
import classes from "./Items.module.css"

// component
import RowContent from "@/shared/RowContent/RowContent";
import HandleActionButton from "./HandleActionButton";

interface RowsProps {
  references: ItemReference[];
  openItemDetails: () => void;
}

const Rows = ({ references, openItemDetails }: RowsProps) => {

  // props padrão de cada linha da tabela
  const tableTdProps: TableTdProps = {
    className: classes.rowContainer,
    height: 55,
  }

  return (
    references.map((reference) => (
      <Table.Tr key={reference.id} data-item-reference-id={reference.id}>
        <Table.Td align="center">
          <HandleActionButton openItemDetails={openItemDetails} itemReferenceId={reference.id!} />
        </Table.Td>
        <Table.Td {...tableTdProps} ><RowContent label={reference.description} /></Table.Td>
        <Table.Td {...tableTdProps} ><RowContent label={reference.internal_code} /></Table.Td>
        <Table.Td {...tableTdProps} ><RowContent label={reference.manufacturer_code} /></Table.Td>
        <Table.Td {...tableTdProps} ><RowContent label={reference.ncm} /></Table.Td>
        <Table.Td {...tableTdProps} >{reference.created_at}</Table.Td>
        <Table.Td {...tableTdProps} >{reference.updated_at}</Table.Td>
      </Table.Tr>
    ))
  )
}

export default Rows;