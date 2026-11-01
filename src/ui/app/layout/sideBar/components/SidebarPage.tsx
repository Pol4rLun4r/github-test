/* eslint-disable @typescript-eslint/no-explicit-any */
// mantine
import { Tooltip, UnstyledButton } from '@mantine/core';

// styles
import classes from '../Sidebar.module.css';

// redux
import { useSelector } from 'react-redux';
import { selectIsSidebarCollapsed } from '../../store/layout.selectors';

// icons
import { IconPencilPlus } from '@tabler/icons-react';

interface TabsProps {
    icon: typeof IconPencilPlus;
    label: string;
    active?: boolean;
    onClick?: () => void;
    ref?: any
}

export const SidebarPage = ({ icon: Icon, label, active, onClick, ref }: TabsProps) => {
    const isSidebarCollapsed = useSelector(selectIsSidebarCollapsed);

    return (
        <div ref={ref}>
            {isSidebarCollapsed ? (
                <Tooltip label={label} position='right' transitionProps={{ duration: 0 }}>
                    <UnstyledButton
                        className={classes.tab}
                        onClick={onClick}
                        data-active={active || undefined}
                        data-collapsed={isSidebarCollapsed}
                        aria-label={label}
                    >
                        <div className={classes.iconContainer} data-collapsed={isSidebarCollapsed}>
                            <Icon size={22} stroke={1.5} className={classes.icon} />
                        </div>
                    </UnstyledButton>
                </Tooltip>
            ) : (
                <UnstyledButton
                    className={classes.tab}
                    onClick={onClick}
                    data-active={active || undefined}
                    data-collapsed={isSidebarCollapsed}
                    aria-label={label}
                >
                    <div className={classes.iconContainer} data-collapsed={isSidebarCollapsed}>
                        <Icon size={22} stroke={1.5} className={classes.icon} />
                    </div>
                    <span className={classes.label}>{label}</span>
                </UnstyledButton>
            )}

        </div>
    )
};