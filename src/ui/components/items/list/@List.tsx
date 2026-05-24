// mantine
import { Paper, Table, VisuallyHidden } from "@mantine/core";

// style
import classes from "./Items.module.css"

// components
import FetchReferences from './FetchReferences.tsx';

const List = () => {
    return (
        <Paper withBorder radius="lg" w={'100%'} h={'100%'} className={classes.items}>
            <Table.ScrollContainer minWidth={900} w={'100%'} h={'100%'}>
                <Table layout="fixed" highlightOnHover stickyHeader w={'100%'} h={'100%'}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th w={'5%'}><VisuallyHidden /></Table.Th>
                            <Table.Th w={'30%'}>Descrição</Table.Th>
                            <Table.Th w={'10%'}>Código interno</Table.Th>
                            <Table.Th w={'10%'}>Código do fabricante</Table.Th>
                            <Table.Th w={'8%'}>NCM</Table.Th>
                            <Table.Th w={'10%'}>Criado em</Table.Th>
                            <Table.Th w={'10%'}>Atualizado em</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <FetchReferences />
                </Table>
            </Table.ScrollContainer>
        </Paper >
    )
}

export default List