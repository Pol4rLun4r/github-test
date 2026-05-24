// mantine
import { ActionIcon, Menu, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

// components
import MoreInfo from "./MoreInfo.tsx";
import MoreInfoModal from "./modals/MoreInfoModal";
import VersionInfo from "./VersionInfo";

// icons
import { IconCopyPlus, IconMenu3, IconPencilMinus, IconTrash } from "@tabler/icons-react";
import VersionInfoModal from "./modals/VersionInfoModal.tsx";

export interface MenuProps {
    itemReferenceId: ItemReference['id'];
    open: () => void
}

const MenuItem = ({ itemReferenceId, notes }: { itemReferenceId: ItemReference['id'], notes: ItemReference['notes'] }) => {
    const [moreInfoOpened, { open: moreInfoOpen, close: moreInfoClose }] = useDisclosure(false);
    const [versionInfoOpened, { open: versionInfoOpen, close: versionInfoClose }] = useDisclosure(false);

    return (
        <>
            <Menu shadow="md" withArrow offset={-1}>
                <Menu.Target>
                    <ActionIcon variant="transparent">
                        <IconMenu3 />
                    </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                    <MoreInfo open={moreInfoOpen} itemReferenceId={itemReferenceId} notes={notes} />
                    <VersionInfo open={versionInfoOpen} itemReferenceId={itemReferenceId} />
                    <Menu.Item
                        leftSection={<IconPencilMinus size={14} />}
                        disabled
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
                        color="red"
                        leftSection={<IconTrash size={14} />}
                        disabled
                    >
                        Deletar referencia
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>

            {/* Modal do `MoreInfo` */}
            <Modal
                padding='xl'
                size="lg"
                opened={moreInfoOpened}
                onClose={moreInfoClose}
                title="Mais informações do item"
                centered
                radius='lg'
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                transitionProps={{ transition: 'fade', duration: 200 }}
            >
                <MoreInfoModal />
            </Modal>

            {/* Modal do `VersionInfo` */}
            <Modal
                padding='xl'
                size="100%"
                opened={versionInfoOpened}
                onClose={versionInfoClose}
                title="Informações sobre os valores do item"
                centered
                radius='lg'
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                transitionProps={{ transition: 'fade', duration: 200 }}
            >
                <VersionInfoModal />
            </Modal>
        </>
    )
}

export default MenuItem;