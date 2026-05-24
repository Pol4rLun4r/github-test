// mantine
import { Table } from "@mantine/core";

// redux
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store.ts";

// components
import Rows from "./Rows.tsx";

export const ViewBudget = ({ budget }: { budget: QuotationFullDetail | undefined }) => {

    const switchMode = useSelector((state: RootState) => state.createBudget.listItemsSwitchMode.mode)

    if (!budget) return 'No data'

    const listItems = budget.items;

    return (
        <Table.ScrollContainer minWidth={switchMode ? 800 : 2000} w={'100%'} h={'100%'}>
            <Table layout="fixed" highlightOnHover stickyHeader>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th w={'5%'}>Item</Table.Th>
                        <Table.Th w={'20%'}>Descrição</Table.Th>
                        <Table.Th w={'10%'}>Valor unitário</Table.Th>
                        <Table.Th w={'8%'}>Qtd</Table.Th>
                        <Table.Th w={'10%'}>Total c/ somas</Table.Th>
                        <Table.Th w={'10%'}>Código interno</Table.Th>
                        <Table.Th w={'10%'}>Embarque</Table.Th>
                        <Table.Th w={'8%'}>Markup (%)</Table.Th>
                        {!switchMode &&
                            <>
                                <Table.Th w={'10%'}>Total s/ somas</Table.Th>
                                <Table.Th w={'10%'}>Valor unit s/ somas</Table.Th>
                                <Table.Th w={'10%'}>Markup unitário</Table.Th>
                                <Table.Th w={'10%'}>Markup total</Table.Th>
                                <Table.Th w={'10%'}>ST</Table.Th>
                                <Table.Th w={'10%'}>IPI (%)</Table.Th>
                                <Table.Th w={'10%'}>Valor IPI</Table.Th>
                                <Table.Th w={'10%'}>Frete de compra</Table.Th>
                                <Table.Th w={'10%'}>Valor extra</Table.Th>
                                <Table.Th w={'10%'}>Valor Total + IPI + ST</Table.Th>
                            </>
                        }
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {listItems.map((item) => (
                        <Rows key={item.quotation_link_id} item={item} />
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}
