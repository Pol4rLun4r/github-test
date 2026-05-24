// react
import { useState } from 'react';

// mantine
import { Stack, FloatingIndicator } from "@mantine/core"

// styles
import classes from './Sidebar.module.css';

// redux
import { useDispatch } from 'react-redux';
import { setActiveTab } from '../../redux/sideBar/tabSlice';
import type { AppDispatch } from '../../redux/store';

// components
import { SidebarTab, tabsData } from './SidebarTabs';

const SidebarMain = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [active, setActive] = useState(0);
    const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
    const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});

    const tabHandle = (index: number) => {
        setActive(index);
        dispatch(setActiveTab(index));
    }

    const setControlRef = (index: number) => (node: HTMLButtonElement) => {
        controlsRefs[index] = node;
        setControlsRefs(controlsRefs);
    }

    const tabs = tabsData.map((tab, index) => (
        <SidebarTab
            {...tab}
            ref={setControlRef(index)}
            key={tab.label}
            active={index === active}
            onClick={() => tabHandle(index)}
        />
    ))

    return (
        <Stack gap={0} ref={setRootRef} className={classes.main}>
            {tabs}

            <FloatingIndicator
                target={controlsRefs[active]}
                parent={rootRef}
                className={classes.indicator}
            />
        </Stack>
    )
}

export default SidebarMain