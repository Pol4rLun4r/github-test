// mantine
import { Anchor, Paper, Stack, Table, Textarea } from "@mantine/core";

// redux
import { useSelector } from 'react-redux';
import { RootState } from "../../../../../redux/store.ts";

const MoreInfoModal = () => {
    const menu = useSelector((state: RootState) => state.items.menu);
    const notes = menu.notes;
    const links = menu.reference_links;

    const hasNotes = notes === undefined ? false : notes === null ? false : notes.length <= 0 ? false : true;

    const rows = links.map((link: Partial<ReferenceLink>, index) => (
        <Table.Tr key={link.id ? link.id : index}>
            <Table.Td width={'90%'}>
                <Anchor target="_blank" href={link.content} size="sm" lineClamp={1} w={"100%"} style={{ wordBreak: 'break-all' }} >{link.content}</Anchor>
            </Table.Td>
        </Table.Tr >
    ));

    return (
        <Stack>
            <Textarea
                label="Notas"
                radius="lg"
                readOnly
                tabIndex={-1}
                placeholder="sem anotações"
                onFocus={(e) => e.target.blur()}
                value={hasNotes ? notes : ""}
                autosize
            />
            <Paper withBorder radius="lg" w={'100%'} h={'100%'}>
                {/* <Table.ScrollContainer minWidth={0} w="100%" maxHeight={300}> */}
                    <Table>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                {/* </Table.ScrollContainer> */}
            </Paper >
        </Stack>
    )
}

export default MoreInfoModal