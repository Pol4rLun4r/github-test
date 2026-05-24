// mantine
import { ActionIcon, Button, Group, Tooltip, Modal } from "@mantine/core"
import { useDisclosure } from '@mantine/hooks';

// redux
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { resetList } from "../../../redux/createBudget/items/listItemsSlice";

// components
import ItemForm from "../itemForm/@ItemForm";
import SwitchMode from "./SwitchMode";

// icons
import { IconPlus, IconTrash } from "@tabler/icons-react"

const Buttons = () => {
    const [itemOpened, { open: itemOpen, close: itemClose }] = useDisclosure(false);
    const [deleteOpened, { open: deleteOpen, close: deleteClose }] = useDisclosure(false);
    const dispatch = useDispatch<AppDispatch>();

    const handleDelete = () => {
        dispatch(resetList())
        deleteClose()
    }

    return (
        <>
            <Group>
                <Tooltip label='Limpar lista' >
                    <ActionIcon
                        size="lg"
                        radius="lg"
                        variant="light"
                        color="var(--mantine-color-red-4)"

                        onClick={deleteOpen}
                    >
                        <IconTrash size={20} />
                    </ActionIcon>
                </Tooltip>
                <SwitchMode />
                <Tooltip label='Adicionar Item'>
                    <Button
                        leftSection={<IconPlus size={20} />}
                        radius="lg"
                        variant="light"
                        onClick={itemOpen}
                    >
                        Item
                    </Button>
                </Tooltip>
            </Group >
            {/* modal do botão para deletar lista */}
            < Modal
                opened={deleteOpened}
                onClose={deleteClose}
                centered
                title="Deseja realmente deletar todos os itens da lista?"
                radius='lg'
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }
                }
            >
                <Button
                    mt="md"
                    radius="lg"
                    variant="light"
                    color="red"
                    fullWidth
                    onClick={() => handleDelete()}
                >
                    Deletar todos
                </Button>
            </ Modal>

            {/* modal do botão para adicionar um item */}
            < Modal
                padding='xl'
                size='lg'
                opened={itemOpened}
                onClose={itemClose}
                title="Adicionar item"
                centered
                radius='lg'

                pos={"relative"}

                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >
                <ItemForm scope="add" close={itemClose} />
            </Modal >
        </>
    )
}

export default Buttons