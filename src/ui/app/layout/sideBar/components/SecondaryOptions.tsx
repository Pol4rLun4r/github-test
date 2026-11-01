// styles
import classes from '../Sidebar.module.css'

// mantine
import { Stack, useMantineColorScheme, useComputedColorScheme } from '@mantine/core'

// icons
import { IconSettings2, IconSun, IconMoon } from '@tabler/icons-react'

// components
import { SidebarPage } from './SidebarPage'; 

const SecondaryOptions = () => {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('dark');

    const colorSchemeHandle = () => {
        setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
    }

    return (
        <Stack gap={0} className={classes.secondaryOptions}>
            <SidebarPage
                icon={computedColorScheme === 'light' ? IconMoon : IconSun}
                label={computedColorScheme === 'light' ? 'Dark mode' : 'Light mode'}
                onClick={colorSchemeHandle}
            />
            <SidebarPage
                icon={IconSettings2}
                label='Settings'
            />
        </Stack>
    )
};

export default SecondaryOptions;