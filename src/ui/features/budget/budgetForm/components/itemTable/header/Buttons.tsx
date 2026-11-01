// mantine
import { ActionIcon, Button, Group, Tooltip, Modal } from "@mantine/core"
import { useDisclosure } from '@mantine/hooks';

// redux
import { BudgetFormScope } from "../../../store/@rootReducer";

// components
import ItemForm from "@/features/budget/itemForm/@ItemForm";
import SwitchMode from "./SwitchMode";

// icons
import { IconPlus, IconTrash } from "@tabler/icons-react"
import { useAppDispatch } from "@/app/reduxHooks";
import { resetTable } from "../../../store/itemTable.slice";

const Buttons = ({ scope }: { scope: BudgetFormScope }) => {
    const [itemOpened, { open: itemOpen, close: itemClose }] = useDisclosure(false);
    const [deleteOpened, { open: deleteOpen, close: deleteClose }] = useDisclosure(false);
    const dispatch = useAppDispatch();

    const handleDelete = () => {
        dispatch(resetTable(scope))
        deleteClose()
    }

    const handleAddItemScope = () => {
        if (scope === 'budget_form_create') return 'item_form_add';
        return 'item_form_add_budget_edit';
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
                title="Deseja realmente deletar todos os itens da lista?"
            >
                <Button
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
                size='lg'
                opened={itemOpened}
                onClose={itemClose}
                title="Adicionar item"
                pos={"relative"}
            >
                <ItemForm scope={handleAddItemScope()} budgetScope={scope} closeModal={itemClose} />
            </Modal >
        </>
    )
}

export default Buttons