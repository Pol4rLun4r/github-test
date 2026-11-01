// mantine
import { ActionIcon, Badge, Group, Tooltip } from "@mantine/core"

// style
import classes from './FrameBar.module.css';

// icons
import { IconSnowflake } from "@tabler/icons-react";

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { toggleSidebar } from "../store/layout.slice";
import { selectIsSidebarCollapsed } from "../store/layout.selectors";

const LeftTitle = () => {
    const dispatch = useAppDispatch();
    const isSidebarCollapsed = useAppSelector(selectIsSidebarCollapsed);

    return (
        <Group gap={1} style={{ justifySelf: 'center' }}>
            <Tooltip
                label={isSidebarCollapsed ? "Expandir" : "Recolher"}
                withinPortal
                zIndex={10000}
                withArrow
                arrowSize={7}
                openDelay={500}
            >
                <ActionIcon
                    variant="transparent"
                    className={classes.noDrag}
                    aria-label={isSidebarCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
                    onClick={() => dispatch(toggleSidebar())}
                    size={"sm"}
                >
                    {/* ao mudar a key, o React remonta o ícone e reinicia a animação CSS de rotação */}
                    <IconSnowflake key={isSidebarCollapsed.toString()} className={classes.snowflake} />
                </ActionIcon>
            </Tooltip>
            <Group gap={6} wrap="nowrap">
                <div>Bear Budgets</div>
                <Badge size="xs" variant="light" color="gray">
                    v{__APP_VERSION__}
                </Badge>
            </Group>
        </Group>
    )
};

export default LeftTitle