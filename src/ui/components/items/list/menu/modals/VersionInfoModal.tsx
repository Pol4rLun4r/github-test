// redux
import { useSelector } from 'react-redux';
import { RootState } from "../../../../../redux/store.ts";

// mantine
import { Table } from '@mantine/core';
import Row from './Row.tsx';

const VersionInfoModal = () => {
    const menu = useSelector((state: RootState) => state.items.menu);
    const versions = menu.item_versions;
    
    const switchMode = useSelector((state: RootState) => state.createBudget.listItemsSwitchMode.mode);

    return (
        <Table.ScrollContainer minWidth={switchMode ? 800 : 2000} w={'100%'} h={'100%'}>
            <Table layout="fixed" highlightOnHover stickyHeader>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th w={'10%'}>Valor unitário</Table.Th>
                        <Table.Th w={'8%'}>Qtd</Table.Th>
                        <Table.Th w={'10%'}>Total c/ somas</Table.Th>
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
                    {versions.map((version) => (
                        <Row key={version.id} item_version={version} />
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
};

export default VersionInfoModal;