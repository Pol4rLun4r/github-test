import { useState } from "react";

// mantine
import { ActionIcon, Menu, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

// icons
import { IconCopyPlus, IconEye, IconMenu3, IconPencilMinus, IconTrash } from "@tabler/icons-react";
import services from '../../../../services/index';

// components
import { ViewBudget } from "../../viewBudget/@ViewBudget";

const MenuBudget = ({ quotationId }: { quotationId: Quotation['id'] }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [quotation, setQuotation] = useState<QuotationFullDetail | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    const handleSeeData = () => {
        const fetchQuotation = async () => {
            setLoading(true);
            try {
                const result = await services.quotation.getFullDetail(quotationId);
                if (result.success) {
                    setQuotation(result.data);
                } else {
                    console.error('Erro ao buscar orçamento:', result.data);
                }
            } catch (error) {
                console.error('Erro ao buscar orçamento:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuotation();
        open();
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
                    <Menu.Item leftSection={<IconEye size={14} />} onClick={() => handleSeeData()}>
                        Ver Orçamento
                    </Menu.Item>
                    <Menu.Item
                        leftSection={<IconPencilMinus size={14} />}
                        disabled
                    >
                        Editar Orçamento
                    </Menu.Item>
                    <Menu.Item
                        leftSection={<IconCopyPlus size={14} />}
                        disabled
                    >
                        Duplicar Orçamento
                    </Menu.Item>
                    <Menu.Item
                        color="red"
                        leftSection={<IconTrash size={14} />}
                        disabled
                    >
                        Deletar Orçamento
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>

            <Modal
                padding='xl'
                size='100%'
                opened={opened}
                onClose={close}
                title="Informações do orçamento"
                centered
                radius='lg'
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >
                {loading ? <div>Carregando...</div> : <ViewBudget budget={quotation} />}
            </Modal>
        </>
    )
}

export default MenuBudget