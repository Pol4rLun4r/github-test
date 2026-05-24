// icons
import { IconSnowflake } from '@tabler/icons-react';

// mantine
import { Avatar, Title } from '@mantine/core';
import { UnstyledButton } from '@mantine/core';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { toggleCollapsed } from '../../redux/sideBar/collapsedSlice';
import type { AppDispatch, RootState } from '../../redux/store';

// styles
import classes from './ToggleSidebar.module.css';

const ToggleSidebar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const collapsed = useSelector((state: RootState) => state.sidebar.collapsed.collapsed)

    const handleCollapse = () => {
        dispatch(toggleCollapsed())
    }

    return (
        <UnstyledButton
            className={classes.toggleSidebar}
            onClick={() => handleCollapse()}
        >
            <div className={classes.iconContainer}>
                <Avatar size='md'>
                    <IconSnowflake />
                </Avatar>
            </div>
            <Title order={3}
                className={classes.label}
                data-collapsed={collapsed}
            >
                Bear Budgets
            </Title >
        </UnstyledButton>
    )
}

export default ToggleSidebar