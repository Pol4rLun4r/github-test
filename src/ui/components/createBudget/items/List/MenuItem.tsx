// mantine
import { ActionIcon, Button, Menu, Modal, Text } from "@mantine/core";
import { useClipboard, useDisclosure } from "@mantine/hooks";

// icon
import { IconCopy, IconCopyPlus, IconMenu3, IconPencilMinus, IconTrash } from "@tabler/icons-react";

// redux
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../../redux/store";
import { addItem, deleteItem } from "../../../../redux/createBudget/items/listItemsSlice";
import { ItemDataState, setItemDataEdit } from "../../../../redux/createBudget/items/itemFormSlice";

// component
import ItemForm from "../../itemForm/@ItemForm";
import { notifications } from "@mantine/notifications";

interface MenuItemType {
  item: ItemDataState;
}

const MenuItem = ({ item }: MenuItemType) => {
  const dispatch = useDispatch<AppDispatch>();

  const clipboard = useClipboard({ timeout: 200 })

  // delete button
  const [deleteOpened, { open: deleteOpen, close: deleteClose }] = useDisclosure(false);

  // edit item
  const [editOpened, { open: editOpen, close: editClose }] = useDisclosure(false);

  const handleDelete = () => {
    dispatch(deleteItem(item.temp_id));
  }

  const handleCopy = () => {
    clipboard.copy(item.item_reference.description);

    notifications.show({
      title: 'Descrição copiada',
      message: 'A descrição do item foi copiada para a área de transferência!',
      position: 'bottom-right',
      color: 'teal'
    })
  }

  const handleEdit = () => {
    dispatch(setItemDataEdit(item))
    editOpen()
  }

  const handleDuplicate = () => {
    dispatch(addItem(item))
  }

  return (
    <>
      <Menu shadow="md" withArrow offset={-1}>
        <Menu.Target>
          <ActionIcon variant="transparent">
            <IconMenu3 />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconPencilMinus size={14} />}
            onClick={() => handleEdit()}
          >
            Editar Item
          </Menu.Item>
          <Menu.Item
            leftSection={<IconCopy size={14} />}
            onClick={() => handleCopy()}
          >
            Copiar Descrição
          </Menu.Item>
          <Menu.Item
            leftSection={<IconCopyPlus size={14} />}
            onClick={() => handleDuplicate()}
          >
            Duplicar Item
          </Menu.Item>
          <Menu.Item
            color="red"
            leftSection={<IconTrash size={14} />}
            onClick={deleteOpen}
          >
            Deletar Item
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      {/* modal do botão deletar */}
      <Modal
        opened={deleteOpened}
        onClose={deleteClose}
        centered
        title="Deseja realmente deletar este item?"
        radius='lg'
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Text c="red">{item.item_reference.description}</Text>
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
        padding='xl'
        size='lg'
        opened={editOpened}
        onClose={editClose}
        title="Editar item"
        centered
        radius='lg'
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <ItemForm scope="edit" close={editClose} />
      </Modal>
    </>
  )
}

export default MenuItem;