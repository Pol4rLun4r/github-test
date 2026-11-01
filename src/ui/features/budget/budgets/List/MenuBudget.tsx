import { useState } from "react";

// mantine
import { ActionIcon, Loader, Menu } from "@mantine/core";
import type { ReactElement } from "react";
import { notifications } from "@mantine/notifications";

// icons
import { IconCopyPlus, IconEyeSpark, IconTrash } from "@tabler/icons-react";
import services from '../../../../services/index';

// redux
import { useAppDispatch } from "@/app/reduxHooks";
import { setOriginalBudget } from "../../budgetForm/store/originalBudgetSlice";
import { setItemTable } from "../../budgetForm/store/itemTable.slice";
import { setQuotation } from "../../budgetForm/store/quotationInfo.slice";

// types para o menu de contexto
interface ContextMenuTargetHandlers {
    onContextMenu: React.MouseEventHandler<HTMLElement>; // função para lidar com o evento de clique com o botão direito do mouse
}

type seeBudgetType = (quotationId: Quotation['id']) => ReactElement;

interface MenuBudgetType {
    open: () => void; // função para abrir o modal
    children: (handlers: ContextMenuTargetHandlers, seeBudget: seeBudgetType) => React.ReactElement // função que recebe os handlers  retorna um elemento React
}

const MenuBudget = ({ open, children }: MenuBudgetType) => {
    const dispatch = useAppDispatch();

    // estado para armazenar o id da cotação ativa (selecionada) ao menu de contexto
    const [loadingQuotationIds, setLoadingQuotationIds] = useState<Set<Quotation['id']>>(new Set());

    // função para obter o id do orçamento a partir do alvo do evento (target)
    const getQuotationIdFromTarget = (target: EventTarget | null) => {
        const row = target instanceof Element ? target.closest<HTMLElement>("[data-budget-id]") : null; // procura o elemento mais próximo com o atributo data-budget-id
        const quotationId = row?.dataset.budgetId; // obtém o valor do atributo data-budget-id
        return quotationId === undefined ? undefined : Number(quotationId); // retorna o id do orçamento
    }

    // função para lidar com o evento de clique com o botão direito do mouse
    const handleContextMenu: React.MouseEventHandler<HTMLElement> = (event) => {
        if (getQuotationIdFromTarget(event.target) === undefined) event.preventDefault();
        // como atualmente o menu não tem nenhuma função ativa, não faz nada
    }

    // função para buscar os dados do orçamento e atualizar o estado do redux
    const handleSeeData = async (quotationId: Quotation['id']) => {
        open();
        setLoadingQuotationIds((current) => new Set(current).add(quotationId)); // adiciona o id do orçamento ao set de loading
        dispatch(setOriginalBudget(null));

        try {
            const result = await services.quotation.getFull(quotationId);

            if (!result.success || !result.data) return;

            const items = result.data.items.map((item) => ({
                ...item,
                temp_id: "",
                toggleStMode: false,
            }));

            // atualiza o estado do redux com os items
            dispatch(setItemTable({
                scope: 'budget_form_edit',
                data: items
            }));

            // atualiza o estado do redux com a cotação
            dispatch(setQuotation({
                scope: 'budget_form_edit',
                data: result.data.quotation
            }));

            // atualiza o estado do redux com o orçamento original
            dispatch(setOriginalBudget({
                quotation: result.data.quotation,
                items,
            }));

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';

            notifications.show({
                title: 'Algo deu errado!',
                message: errorMessage,
                color: 'pink',
                position: 'bottom-right'
            })
        } finally {
            setLoadingQuotationIds((current) => {
                const next = new Set(current);
                next.delete(quotationId);
                return next;
            });
        }
    }

    // função para renderizar o botão de ver orçamento
    const seeBudget: seeBudgetType = (quotationId) => (
        <ActionIcon onClick={() => handleSeeData(quotationId)} variant="transparent">
            {loadingQuotationIds.has(quotationId) ? <Loader size={16} /> : <IconEyeSpark />}
        </ActionIcon>
    );

    // itens do menu de contexto
    const menuItems = (
        <>
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
        </>
    );

    return (
        <Menu shadow="md" withArrow offset={-1}>
            <Menu.ContextMenu>
                {/* passa os handlers e a função seeBudget para os filhos */}
                {children({ onContextMenu: handleContextMenu }, seeBudget)}
            </Menu.ContextMenu>

            <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
    )
}

export default MenuBudget