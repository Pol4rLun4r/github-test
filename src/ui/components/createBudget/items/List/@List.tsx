// mantine
import { Table, VisuallyHidden } from "@mantine/core"

// redux
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { reorderItems } from "../../../../redux/createBudget/items/listItemsSlice";

// components
import SortableRow from "./SortableRow";

// dnd-kit
import { DragDropProvider } from "@dnd-kit/react";

const List = () => {
    const dispatch = useDispatch<AppDispatch>();
    const listItems = useSelector((state: RootState) => state.createBudget.listItems);
    const switchMode = useSelector((state: RootState) => state.createBudget.listItemsSwitchMode.mode);

    const handleDragEnd: React.ComponentProps<typeof DragDropProvider>["onDragEnd"] = (event) => {
        if (event.canceled) return console.log('canceled'); // cancela a operação se cancelado

        const { source } = event.operation;

        if (!source) return console.log('no source'); // cancela a operação se não houver source (item que está sendo arrastado)

        // ------------- corrigir erro de typagem --------------- //

        // @ts-expect-error source tem initialIndex
        const oldIndex = source.initialIndex; // index do item que está sendo arrastado 
        // @ts-expect-error source tem index
        const newIndex = source.index; // index para onde o item está sendo arrastado

        if (oldIndex === newIndex) return; // cancela a operação se o item está sendo arrastado para a mesma posição

        dispatch(reorderItems({ oldIndex, newIndex }));
    };

    return (
        <DragDropProvider onDragEnd={handleDragEnd}>
            <Table.ScrollContainer minWidth={switchMode ? 800 : 2000} w={'100%'} h={'100%'}>
                <Table layout="fixed" highlightOnHover stickyHeader>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th w={'5%'}><VisuallyHidden /></Table.Th>
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
                        {listItems.map((item, index) => (
                            <SortableRow key={item.temp_id} item={item} index={index} />
                        ))}
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
        </DragDropProvider>
    )
}

export default List;