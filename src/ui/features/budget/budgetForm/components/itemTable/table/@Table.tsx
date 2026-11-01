// mantine
import { Table as MantineTable } from "@mantine/core"

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { BudgetFormScope } from "../../../store/@rootReducer";
import { reorderItems } from "../../../store/itemTable.slice";

// components
import MenuItem from "./MenuItem";
import Row from "./Row";

// dnd-kit
import { DragDropProvider } from "@dnd-kit/react";


const List = ({ scope }: { scope: BudgetFormScope }) => {
    const dispatch = useAppDispatch();
    const listItems = useAppSelector((state) => state.budgetForm.itemTable[scope]);
    const switchMode = useAppSelector((state) => state.budgetForm.itemTableSwitch.mode);

    const rows = listItems.map((item, index) => (
        <Row key={item.temp_id} item={item} index={index} />
    ));

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

        dispatch(reorderItems({ scope, position: { oldIndex, newIndex } }));
    };

    return (
        <DragDropProvider onDragEnd={handleDragEnd}>
            <MenuItem scope={scope} items={listItems}>
                {(handlers) => (
                    <MantineTable.ScrollContainer
                        minWidth={switchMode ? 800 : 2000}
                        w={'100%'}
                        h={'100%'}
                        onContextMenu={handlers.onContextMenu}
                    >
                        <MantineTable layout="fixed" highlightOnHover stickyHeader>
                            <MantineTable.Thead>
                                <MantineTable.Tr>
                                    <MantineTable.Th w={'5%'}>Item</MantineTable.Th>
                                    <MantineTable.Th w={'20%'}>Descrição</MantineTable.Th>
                                    <MantineTable.Th w={'10%'}>Código interno</MantineTable.Th>
                                    <MantineTable.Th w={'10%'}>Valor unitário</MantineTable.Th>
                                    <MantineTable.Th w={'8%'}>Qtd</MantineTable.Th>
                                    <MantineTable.Th w={'10%'}>Total c/ somas</MantineTable.Th>
                                    <MantineTable.Th w={'10%'}>Embarque + Entrega</MantineTable.Th>
                                    <MantineTable.Th w={'8%'}>Markup (%)</MantineTable.Th>
                                    {!switchMode &&
                                        <>
                                            <MantineTable.Th w={'10%'}>Total s/ somas</MantineTable.Th>
                                            <MantineTable.Th w={'10%'}>Valor unit s/ somas</MantineTable.Th>
                                            <MantineTable.Th w={'10%'}>Markup unitário</MantineTable.Th>
                                            <MantineTable.Th w={'10%'}>Markup total</MantineTable.Th>
                                            <MantineTable.Th w={'10%'}>ST</MantineTable.Th>
                                            <MantineTable.Th w={'10%'}>IPI (%)</MantineTable.Th>
                                            <MantineTable.Th w={'10%'}>Valor IPI</MantineTable.Th>
                                            <MantineTable.Th w={'10%'}>Frete de compra</MantineTable.Th>
                                            <MantineTable.Th w={'10%'}>Valor extra</MantineTable.Th>
                                            <MantineTable.Th w={'10%'}>Valor Total + IPI + ST</MantineTable.Th>
                                        </>
                                    }
                                </MantineTable.Tr>
                            </MantineTable.Thead>
                            <MantineTable.Tbody>{rows}</MantineTable.Tbody>
                        </MantineTable>
                    </MantineTable.ScrollContainer>
                )}
            </MenuItem>
        </DragDropProvider>
    )
}

export default List;