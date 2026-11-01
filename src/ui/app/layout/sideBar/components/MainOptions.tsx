// react
import { useMemo, useState } from 'react';
import type { RefCallback } from 'react';

// mantine
import { Stack, FloatingIndicator } from "@mantine/core"

// styles
import classes from '../Sidebar.module.css';

// redux
import { useAppDispatch, useAppSelector } from '@/app/reduxHooks';
import { setActivePage } from '../../store/layout.slice';
import { activePage } from '../../store/layout.selectors';

// components
import { SidebarPage } from './SidebarPage';
import { pagesData, type PageId } from '../../pages';

const MainOptions = () => {
    const dispatch = useAppDispatch();

    const active = useAppSelector(activePage);
    const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
    const [controlsRefs, setControlsRefs] = useState<Partial<Record<PageId, HTMLButtonElement | null>>>({});

    const controlRefCallbacks = useMemo(() => {
        const callbacks = {} as Record<PageId, RefCallback<HTMLButtonElement>>;

        pagesData.forEach(({ id }) => {
            callbacks[id] = (node) => {
                setControlsRefs((refs) => ({ ...refs, [id]: node }));
            };
        });

        return callbacks;
    }, []);

    const pages = pagesData.map((page) => (
        <SidebarPage
            {...page}
            ref={controlRefCallbacks[page.id]}
            key={page.id}
            active={page.id === active}
            onClick={() => dispatch(setActivePage(page.id))}
        />
    ))

    return (
        <Stack gap={0} ref={setRootRef} className={classes.mainOptions}>
            {pages}

            <FloatingIndicator
                target={controlsRefs[active]}
                parent={rootRef}
                className={classes.indicator}
            />
        </Stack>
    )
}

export default MainOptions;