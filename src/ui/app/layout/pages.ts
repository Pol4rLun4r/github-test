// react
import { JSX } from 'react';

// icons
import { IconClipboardList, IconFiles, IconPencilPlus } from '@tabler/icons-react';

// pages
import CreateBudgetPage from '@/features/budget/CreateBudgetPage';
import BudgetsPage from '@/features/budget/BudgetsPage';
import ItemsPages from '@/features/items/@ItemsPage';

export const pagesData = [
    { icon: IconPencilPlus, label: 'Criar orçamento', id: 'create-budget' },
    { icon: IconFiles, label: 'Orçamentos', id: 'budgets' },
    { icon: IconClipboardList, label: 'Itens', id: 'items' }
] as const;

export type PageId = typeof pagesData[number]['id'];

export const pageContentById: Record<PageId, () => JSX.Element> = {
    'create-budget': CreateBudgetPage,
    'budgets': BudgetsPage,
    'items': ItemsPages
}