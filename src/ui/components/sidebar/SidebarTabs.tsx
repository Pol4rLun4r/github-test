/* eslint-disable @typescript-eslint/no-explicit-any */
// mantine
import { Tooltip, UnstyledButton } from '@mantine/core';

// styles
import classes from './Sidebar.module.css';

// redux
import { useSelector } from 'react-redux';
import { type RootState } from '../../redux/store';

// icons
import {
    IconBook,
    IconPencilPlus,
    IconFiles,
    IconClipboardList
} from '@tabler/icons-react';

interface TabsProps {
    icon: typeof IconPencilPlus;
    label: string;
    active?: boolean;
    onClick?: () => void;
    ref?: any
}

export const SidebarTab = ({ icon: Icon, label, active, onClick, ref }: TabsProps) => {
    const collapsed = useSelector((state: RootState) => state.sidebar.collapsed.collapsed);

    return (
        <div ref={ref}>
            {collapsed ? (
                <Tooltip label={label} position='right' transitionProps={{ duration: 0 }}>
                    <UnstyledButton
                        className={classes.tab}
                        onClick={onClick}
                        data-active={active || undefined}
                        data-collapsed={collapsed}
                        aria-label={label}
                    >
                        <div className={classes.iconContainer} data-collapsed={collapsed}>
                            <Icon size={22} stroke={1.5} className={classes.icon} />
                        </div>
                    </UnstyledButton>
                </Tooltip>
            ) : (
                <UnstyledButton
                    className={classes.tab}
                    onClick={onClick}
                    data-active={active || undefined}
                    data-collapsed={collapsed}
                    aria-label={label}
                >
                    <div className={classes.iconContainer} data-collapsed={collapsed}>
                        <Icon size={22} stroke={1.5} className={classes.icon} />
                    </div>
                    <span className={classes.label}>{label}</span>
                </UnstyledButton>
            )}

        </div>
    )
};

// eslint-disable-next-line react-refresh/only-export-components
export const tabsData = [
    { icon: IconPencilPlus, label: 'Create budget' },
    { icon: IconFiles, label: 'Budgets' },
    { icon: IconClipboardList, label: 'Items'},
    { icon: IconBook, label: 'Scripts' },
]