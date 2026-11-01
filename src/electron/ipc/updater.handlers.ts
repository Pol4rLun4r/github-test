// updater
import { downloadAppUpdate, getAppUpdateState, installAppUpdate } from "../app/updater.js";
import { ipcMainHandle } from "../utils/electron.js";

/** Registra ações de atualização solicitadas pela interface */
const updaterHandlers = () => {
    ipcMainHandle("update:getState", () => getAppUpdateState());
    ipcMainHandle("update:download", async () => {
        await downloadAppUpdate();
    });
    ipcMainHandle("update:install", () => installAppUpdate());
};

export default updaterHandlers;
