// mantine
import { Button, Modal, Textarea, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks.ts";
import { getItemFormState, isHasNotes } from "../../../store/itemForm.selectors";
import { setReferenceField, type ItemFormScope } from "../../../store/itemForm.slice";

const Notes = ({ scope }: { scope: ItemFormScope }) => {
    const [opened, { open, close }] = useDisclosure(false);

    const dispatch = useAppDispatch();

    const { item_reference } = useAppSelector((state) => getItemFormState(state, scope));
    const hasNotes = useAppSelector((state) => isHasNotes(state, scope))

    return (
        <>
            <Tooltip
                disabled={hasNotes ? false : true}
                label={item_reference.notes as string || ''}
                multiline
                w={250}
            >
                <Button
                    variant={hasNotes ? "outline" : "default"}
                    radius="lg"
                    onClick={open}
                    style={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                    }}
                >
                    {hasNotes ? `Notas` : 'Adicionar notas'}
                </Button>
            </Tooltip>
            <Modal
                opened={opened}
                onClose={close}
                title="Notas/Anotações"
                size="lg"
                transitionProps={{ transition: 'fade', duration: 200 }}
            >
                <Textarea
                    // design
                    label="Notas sobre o item"
                    radius="lg"
                    placeholder="(opcional) sem anotações no momento"
                    autosize
                    minRows={10}
                    maxRows={20}

                    // valores
                    readOnly={!!item_reference.id} // desabilita se já tiver um item selecionado
                    value={item_reference.notes as string || ''}
                    onChange={(e) => dispatch(setReferenceField({ scope, key: 'notes', value: e.currentTarget.value }))}
                />
            </Modal>
        </>
    )
}

export default Notes;