import { memo } from "react";

// mantine
import { Paper, Table, VisuallyHidden } from "@mantine/core"

// components
import Rows from "./Rows.tsx";
import MenuBudget from "./MenuBudget.tsx";

// style
import classes from "./Items.module.css"

interface ListType {
    budgets: Quotation[];
    open: () => void;
}

const List = ({ budgets, open }: ListType ) => {

    return (
        <Paper withBorder radius="lg" w={'100%'} h={'100%'} className={classes.items}>
            <MenuBudget open={open}>
                {(handlers, seeBudget) => (
                    <Table.ScrollContainer
                        minWidth={700}
                        w={'100%'}
                        h={'100%'}
                        onContextMenu={handlers.onContextMenu}
                    >
                        <Table layout="fixed" highlightOnHover stickyHeader w={'100%'} h={'100%'}>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th w={'3%'}><VisuallyHidden /></Table.Th>
                                    <Table.Th w={'10%'}>Nº do Orçamento</Table.Th>
                                    <Table.Th w={'20%'}>Notas</Table.Th>
                                    <Table.Th w={'10%'}>Valor Total</Table.Th>
                                    <Table.Th w={'5%'}>Itens</Table.Th>
                                    <Table.Th w={'10%'}>Data de criação</Table.Th>
                                    <Table.Th w={'10%'}>Ultima atualização</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody><Rows seeBudget={seeBudget} budgets={budgets} /></Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                )}
            </MenuBudget>
        </Paper >
    )
}

export default memo(List);