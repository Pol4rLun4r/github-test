import { useState } from "react";

// mantine
import { Menu } from "@mantine/core";

// icons
import { IconCopyPlus, IconPencilMinus, IconTrash } from "@tabler/icons-react";

// hooks
import useCustomModal from "@/hooks/useCustomModal";

// components
import EditItemReference from "./EditItemReference/@EditItemReference";

// obsoleto?
export interface MenuProps {
    itemReferenceId: ItemReference['id'];
    open: () => void
}

// types para o menu de contexto
interface ContextMenuTargetHandlers {
    onContextMenu: React.MouseEventHandler<HTMLElement>; // função para lidar com o evento de clique com o botão direito do mouse
}

interface MenuItemProps {
    children: (handlers: ContextMenuTargetHandlers) => React.ReactElement // função que recebe os handlers retorna um elemento React
}

const MenuItem = ({ children }: MenuItemProps) => {
    // estado para armazenar o id do item reference ativo (selecionado) ao menu de contexto
    const [itemReferenceId, setItemReferenceId] = useState<ItemReference['id'] | null>(null);

    // função para obter o id do orçamento a partir do alvo do evento (target)
    const getItemReferenceIdFromTarget = (target: EventTarget | null) => {
        const row = target instanceof Element ? target.closest<HTMLElement>("[data-item-reference-id]") : null; // procura o elemento mais próximo com o atributo data-budget-id
        const id = row?.dataset.itemReferenceId; // obtém o valor do atributo data-item-reference-id
        return id === undefined ? undefined : Number(id); // retorna o id do item reference
    }

    // função para lidar com o evento de clique com o botão direito do mouse
    const handleContextMenu: React.MouseEventHandler<HTMLElement> = (event) => {
        const id = getItemReferenceIdFromTarget(event.target)
        if (id === undefined) event.preventDefault();
        setItemReferenceId(id);
    }

    // editItemReference
    const { handlers: handlersEdit, modal: modalEdit } = useCustomModal({
        children: ({ close }) => (
            <EditItemReference itemReferenceId={itemReferenceId as number | undefined} onSaved={close} />
        ),
        size: "lg",
        withCloseButton: false,
    });

    // itens do menu de contexto
    const menuItems = (
        <>
            <Menu.Item
                leftSection={<IconPencilMinus size={14} />}
                onClick={handlersEdit.open}
            >
                Editar referencia do item
            </Menu.Item>
            <Menu.Item
                leftSection={<IconCopyPlus size={14} />}
                disabled
            >
                Duplicar referencia
            </Menu.Item>
            <Menu.Item
                c="red"
                leftSection={<IconTrash size={14} />}
                disabled
            >
                Deletar referencia
            </Menu.Item>
        </>
    )

    return (
        <>
            {modalEdit}
            <Menu shadow="md" withArrow offset={-1}>
                <Menu.ContextMenu>
                    {/* passa os handlers para os filhos */}
                    {children({ onContextMenu: handleContextMenu })}
                </Menu.ContextMenu>

                <Menu.Dropdown>{menuItems}</Menu.Dropdown>
            </Menu>
        </>
    )
}

export default MenuItem;