/* eslint-disable @typescript-eslint/no-explicit-any */
// mantine
import { Tooltip, UnstyledButton } from '@mantine/core';
import type { ReactNode } from 'react';

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
    tooltip?: ReactNode;
    iconContent?: ReactNode;
    disabled?: boolean;
    highlighted?: boolean;
    success?: boolean;
    ref?: any
}

export const SidebarPage = ({
    icon: Icon,
    label,
    active,
    onClick,
    tooltip,
    iconContent,
    disabled,
    highlighted,
    success,
    ref
}: TabsProps) => {
    const isSidebarCollapsed = useSelector(selectIsSidebarCollapsed);

    return (
        <div ref={ref}>
            <Tooltip
                label={tooltip ?? label}
                disabled={!tooltip && !isSidebarCollapsed}
                position='right'
                transitionProps={{ duration: 0 }}
            >
                <UnstyledButton
                    className={classes.tab}
                    onClick={disabled ? undefined : onClick}
                    data-active={active || undefined}
                    data-highlighted={highlighted || undefined}
                    data-success={success || undefined}
                    data-collapsed={isSidebarCollapsed}
                    aria-label={label}
                    aria-disabled={disabled || undefined}
                >
                    <div className={classes.iconContainer} data-collapsed={isSidebarCollapsed}>
                        {iconContent ?? <Icon size={22} stroke={1.5} className={classes.icon} />}
                    </div>
                    {!isSidebarCollapsed && <span className={classes.label}>{label}</span>}
                </UnstyledButton>
            </Tooltip>
        </div>
    )
};