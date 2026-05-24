// styles
import classes from './Sidebar.module.css';

// components
import SidebarMain from './SidebarMain';
import SidebarOptions from './SidebarOptions';
import ToggleSidebar from './ToggleSidebar';

// redux
import { useSelector } from 'react-redux';
import { type RootState } from '../../redux/store';

const Sidebar = () => {
    const collapsed = useSelector((state: RootState) => state.sidebar.collapsed.collapsed);

    return (
        <nav className={classes.sidebar} data-collapsed={collapsed}>
            <ToggleSidebar />
            <SidebarMain />
            <SidebarOptions />
        </nav>
    )
}

export default Sidebar