// mantine
import { Table, Anchor, UnstyledButton, Tooltip } from "@mantine/core";

// type
import { ItemFormScope } from "../../../../../redux/createBudget/items/itemFormSlice";

// icon
import { IconTrash } from "@tabler/icons-react";

// redux
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { removeLink } from "../../../../../redux/createBudget/items/itemFormSlice";

const List = ({ links, scope }: { links: Partial<ReferenceLink>[]; scope: ItemFormScope }) => {
    const dispatch = useDispatch<AppDispatch>();
    const hasId = useSelector((state: RootState) => state.createBudget.itemForm[scope].item_reference.id);

    const handleRemove = (index: number) => {
        dispatch(removeLink({ scope, index }));
    };

    const rows = links.map((link: Partial<ReferenceLink>, index) => (
        <Table.Tr key={link.id ? link.id : index}>
            <Table.Td width={'90%'}>
                <Anchor target="_blank" href={link.content} size="sm" lineClamp={1} w={"100%"} style={{ wordBreak: 'break-all' }} >{link.content}</Anchor>
            </Table.Td>
            <Table.Td>
                {hasId === undefined ? (
                    <Tooltip label='Deletar nota' position="right">
                        <UnstyledButton onClick={() => handleRemove(index)}>
                            <IconTrash size={15} color="var(--mantine-color-dimmed)" />
                        </UnstyledButton>
                    </Tooltip>
                ) :
                    null
                }
            </Table.Td>
        </Table.Tr >
    ));
    
    return (
        <Table.ScrollContainer minWidth={0} w="100%" maxHeight={300}>
            <Table>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}

export default List