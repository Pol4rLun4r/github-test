import { useEffect, useState } from "react";

const initialState: AppUpdateState = { status: "idle" };

/** Mantém a interface sincronizada com o estado do updater do processo Electron */
export const useAppUpdate = () => {
    const [state, setState] = useState<AppUpdateState>(initialState);

    useEffect(() => {
        let receivedEvent = false;
        const unsubscribe = window.api.updates.onStateChange((nextState) => {
            receivedEvent = true;
            setState(nextState);
        });

        void window.api.updates.getState()
            .then((currentState) => {
                if (!receivedEvent) setState(currentState);
            })
            .catch((error: unknown) => {
                console.error("Failed to load application update state:", error);
            });

        return unsubscribe;
    }, []);

    return state;
};
