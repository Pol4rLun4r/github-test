// styles
import classes from './Sidebar.module.css';

// components
import MainOptions from './components/MainOptions';
import SecondaryOptions from './components/SecondaryOptions';

// redux
import { useAppSelector } from '@/app/reduxHooks';
import { selectIsSidebarCollapsed } from '../store/layout.selectors';

const Sidebar = () => {
        const isSidebarCollapsed = useAppSelector(selectIsSidebarCollapsed);

    return (
        <nav className={classes.sideBar} data-collapsed={isSidebarCollapsed}>
            <MainOptions />
            <SecondaryOptions />
        </nav>
    )
}

export default Sidebar;