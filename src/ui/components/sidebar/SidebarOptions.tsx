// styles
import classes from './Sidebar.module.css'

// mantine
import { Stack, useMantineColorScheme, useComputedColorScheme } from '@mantine/core'

// icons
import { IconSettings2, IconSun, IconMoon } from '@tabler/icons-react'

// components
import { SidebarTab } from './SidebarTabs';

const SidebarOptions = () => {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('dark');

    const colorSchemeHandle = () => {
        setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
    }

    return (
        <Stack gap={0} className={classes.second}>
            <SidebarTab
                icon={computedColorScheme === 'light' ? IconMoon : IconSun}
                label={computedColorScheme === 'light' ? 'Dark mode' : 'Light mode'}
                onClick={colorSchemeHandle}
            />
            <SidebarTab
                icon={IconSettings2}
                label='Settings'
            />
        </Stack>
    )
};

export default SidebarOptions