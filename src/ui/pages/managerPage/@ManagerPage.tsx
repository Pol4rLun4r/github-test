import type { ReactNode } from 'react';

// redux
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

// tabs
import CreateBudget from '../createBudget/@CreateBudget';
import Budgets from './../budgets/@Budgets';
import ComingSoon from '../comingSoon/@ComingSoon';
import Items from '../items/@Items.tsx';

// styles
import classes from './ManagerPage.module.css';


const ManagerPage = () => {
    const tabState = useSelector((state: RootState) => state.sidebar.tab.activeTab);
    const tabContentById: Record<number, ReactNode> = {
        0: <CreateBudget />,
        1: <Budgets />,
        2: <Items/>
    };

    return (
        <main className={classes.main}>
            {tabContentById[tabState] ?? <ComingSoon />}
        </main>
    )
}

export default ManagerPage