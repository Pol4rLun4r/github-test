// mantine
import { Button, Menu, Modal, Text } from "@mantine/core";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import { useState } from "react";

// icon
import { IconCopy, IconCopyPlus, IconPencilMinus, IconTrash } from "@tabler/icons-react";

// redux
import { ItemFormState, setItemForm } from "@/features/budget/itemForm/store/itemForm.slice";


// component
import ItemForm from "../../../../itemForm/@ItemForm";
import { notifications } from "@mantine/notifications";
import { BudgetFormScope } from "../../../store/@rootReducer";
import { useAppDispatch } from "@/app/reduxHooks";
import { addItem, deleteItem } from "../../../store/itemTable.slice";

// types para o menu de contexto
interface ContextMenuTargetHandlers {
  onContextMenu: React.MouseEventHandler<HTMLElement>; // função para lidar com o evento de clique com o botão direito do mouse
}

interface MenuItemType {
  items: ItemFormState[]; // array de itens do tipo ItemDataState
  scope: BudgetFormScope; // escopo do formulário de orçamento
  children: (handlers: ContextMenuTargetHandlers) => React.ReactElement; // função que recebe os handlers e retorna um elemento React
}

const MenuItem = ({ items, scope, children }: MenuItemType) => {
  const dispatch = useAppDispatch();

  // estado para armazenar o item ativo (selecionado) no menu de contexto
  const [activeItem, setActiveItem] = useState<ItemFormState | null>(null);

  // função para usar o clipboard
  const clipboard = useClipboard({ timeout: 200 })

  // delete button modal
  const [deleteOpened, { open: deleteOpen, close: deleteClose }] = useDisclosure(false);

  // edit item modal
  const [editOpened, { open: editOpen, close: editClose }] = useDisclosure(false);

  // função para obter o item a partir do alvo do evento (target)
  const getItemFromTarget = (target: EventTarget | null) => {
    const row = target instanceof Element ? target.closest<HTMLElement>("[data-item-id]") : null; // procura o elemento mais próximo com o atributo data-item-id
    const itemId = row?.dataset.itemId; // obtém o valor do atributo data-item-id
    return items.find((listItem) => listItem.temp_id === itemId); // procura o item correspondente no array de itens
  }

  // função para lidar com o evento de clique com o botão direito do mouse
  const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    const item = getItemFromTarget(event.target);
    if (!item) {
      event.preventDefault();
      return;
    }

    setActiveItem(item);
  }

  const handleDelete = () => {
    if (!activeItem) return;
    dispatch(deleteItem({ scope, tempItemId: activeItem.temp_id }));
    deleteClose();
  }

  const handleCopy = () => {
    if (!activeItem) return;
    clipboard.copy(activeItem.item_reference.description);

    notifications.show({
      title: 'Descrição copiada',
      message: 'A descrição do item foi copiada para a área de transferência!',
      position: 'bottom-right',
      color: 'teal'
    })
  }

  const handleEdit = () => {
    if (!activeItem) return;
    dispatch(setItemForm({scope: "item_form_edit", item: activeItem}))
    editOpen()
  }

  const handleDuplicate = () => {
    if (!activeItem) return;
    dispatch(addItem({ scope, data: activeItem }))
  }

  const menuItems = (
    <>
      <Menu.Item
        leftSection={<IconPencilMinus size={14} />}
        disabled={!activeItem}
        onClick={handleEdit}
      >
        Editar Item
      </Menu.Item>
      <Menu.Item
        leftSection={<IconCopy size={14} />}
        disabled={!activeItem}
        onClick={handleCopy}
      >
        Copiar Descrição
      </Menu.Item>
      <Menu.Item
        leftSection={<IconCopyPlus size={14} />}
        disabled={!activeItem}
        onClick={handleDuplicate}
      >
        Duplicar Item
      </Menu.Item>
      <Menu.Item
        color="red"
        leftSection={<IconTrash size={14} />}
        disabled={!activeItem}
        onClick={deleteOpen}
      >
        Deletar Item
      </Menu.Item>
    </>
  )

  return (
    <>
      <Menu shadow="md" withArrow offset={-1}>
        <Menu.ContextMenu>
          {children({ onContextMenu: handleContextMenu })}
        </Menu.ContextMenu>

        <Menu.Dropdown>{menuItems}</Menu.Dropdown>
      </Menu>

      {/* modal do botão deletar */}
      <Modal
        opened={deleteOpened && activeItem !== null}
        onClose={deleteClose}
        title="Deseja realmente deletar este item?"
      >
        <Text c="red">Item: {activeItem && activeItem!.item_values.position! + 1} - {activeItem?.item_reference.description}</Text>
        <Button
          mt="md"
          radius="lg"
          variant="light"
          color="red"
          fullWidth
          onClick={() => handleDelete()}
        >
          Deletar Item
        </Button>
      </Modal>

      {/* modal do botão editar */}
      <Modal
        size='lg'
        opened={editOpened && activeItem !== null}
        onClose={editClose}
        title="Editar item"
      >
        <ItemForm budgetScope={scope} scope="item_form_edit" closeModal={editClose} />
      </Modal>
    </>
  )
}

export default MenuItem;