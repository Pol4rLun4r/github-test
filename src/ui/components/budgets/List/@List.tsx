// mantine
import { Paper, Table, VisuallyHidden } from "@mantine/core";

// components
import Rows from "./Rows.tsx";

// style
import classes from "./Items.module.css"

const List = ({ budgets }: { budgets: QuotationSummary[] }) => {
    return (
        <Paper withBorder radius="lg" w={'100%'} h={'100%'} className={classes.items}>
            <Table.ScrollContainer minWidth={700} w={'100%'} h={'100%'}>
                <Table layout="fixed" highlightOnHover stickyHeader w={'100%'} h={'100%'}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th w={'5%'}><VisuallyHidden /></Table.Th>
                            <Table.Th w={'30%'}>Cliente</Table.Th>
                            <Table.Th w={'20%'}>Documento</Table.Th>
                            <Table.Th w={'10%'}>Valor Total</Table.Th>
                            <Table.Th w={'5%'}>Itens</Table.Th>
                            <Table.Th w={'10%'}>Data de criação</Table.Th>
                            <Table.Th w={'10%'}>Ultima atualização</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody><Rows budgets={budgets} /> </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
        </Paper >
    )
}

export default List;