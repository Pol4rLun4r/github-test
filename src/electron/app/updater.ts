// electron
import { app } from "electron";
import { createRequire } from "node:module";

// ipc
import { publishAppUpdateState } from "../ipc/updater.events.js";

const require = createRequire(import.meta.url);
const electronUpdater: typeof import("electron-updater") = require("electron-updater");
const { autoUpdater } = electronUpdater;

let appUpdateState: AppUpdateState = { status: "idle" };

const setAppUpdateState = (state: AppUpdateState) => {
    appUpdateState = state;
    publishAppUpdateState(state);
};

/** Retorna o estado atual do updater para a interface */
export const getAppUpdateState = () => appUpdateState;

/** Inicia o download da atualização encontrada */
export const downloadAppUpdate = async () => {
    if (appUpdateState.status !== "available") return;

    setAppUpdateState({
        status: "downloading",
        version: appUpdateState.version,
        percent: 0,
    });

    try {
        await autoUpdater.downloadUpdate();
    } catch (error) {
        console.error("Failed to download application update:", error);
        setAppUpdateState({
            status: "error",
            version: appUpdateState.version,
            error: "Não foi possível baixar a atualização.",
        });
        throw error;
    }
};

/** Fecha o aplicativo e inicia a instalação da atualização baixada */
export const installAppUpdate = () => {
    if (appUpdateState.status !== "downloaded") return;
    autoUpdater.quitAndInstall();
};

/** Configura a verificação e o download de atualizações do aplicativo */
export const setupAutoUpdater = () => {
    // a primeira versão do fluxo de atualização atende somente ao instalador Windows
    if (process.platform !== "win32") {
        setAppUpdateState({ status: "unsupported" });
        console.info("Application updates are currently supported only on Windows.");
        return;
    }

    // força o uso do feed de desenvolvimento para permitir testar updates fora do app empacotado
    autoUpdater.forceDevUpdateConfig = !app.isPackaged;
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = false;

    // registra os eventos antes de iniciar a verificação para não perder atualizações rápidas
    autoUpdater.on("checking-for-update", () => {
        setAppUpdateState({ status: "checking" });
        console.info("Checking for application updates...");
    });

    autoUpdater.on("update-available", (updateInfo) => {
        setAppUpdateState({ status: "available", version: updateInfo.version });
        console.info(`Application update available: ${updateInfo.version}`);
    });

    autoUpdater.on("update-not-available", (updateInfo) => {
        setAppUpdateState({ status: "not-available", version: updateInfo.version });
        console.info(`Application is up to date (${updateInfo.version}).`);
    });

    autoUpdater.on("download-progress", (progress) => {
        setAppUpdateState({
            status: "downloading",
            version: appUpdateState.version,
            percent: progress.percent,
        });
        console.info(`Application update download: ${progress.percent.toFixed(1)}%`);
    });

    autoUpdater.on("update-downloaded", (updateInfo) => {
        setAppUpdateState({ status: "downloaded", version: updateInfo.version });
        console.info(`Application update downloaded: ${updateInfo.version}`);
    });

    autoUpdater.on("error", (error) => {
        setAppUpdateState({
            status: "error",
            version: appUpdateState.version,
            error: "Ocorreu um erro ao verificar ou baixar a atualização.",
        });
        console.error("Application update error:", error);
    });

    const updateSource = app.isPackaged ? "GitHub Releases" : "development GitHub Releases";
    console.info(`Starting update check from ${updateSource}...`);
    setAppUpdateState({ status: "checking" });

    // a checagem não bloqueia a inicialização do aplicativo
    void autoUpdater.checkForUpdates().catch((error: unknown) => {
        setAppUpdateState({
            status: "error",
            error: "Não foi possível verificar se há atualizações.",
        });
        console.error("Failed to check for application updates:", error);
    });
};
