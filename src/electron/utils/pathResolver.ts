import path from "path";
import { app } from "electron";

// utils
import { isDev, isTest } from "./env.js";

// em build o electron-builder mete o preload em extraResources → fica em resources/; confio no isPackaged em vez de adivinhar ../ a partir do asar
export const getPreloadPath = () => {
    const name = path.join("dist-electron", "preload.cjs");
    const resolved = app.isPackaged
        ? path.resolve(process.resourcesPath, name)
        : path.resolve(app.getAppPath(), name);
    return path.normalize(resolved);
};

// path canónico do index do React — tem de bater certo com o que o WebFrame reporta no IPC
export function getUIPath() {
    return path.normalize(
        path.resolve(app.getAppPath(), "dist-react", "index.html"),
    );
}

// normalizei com resolve pra não me lixar com join() e barras à frente tipo /dist-react
export function getAssetPath() {
    return path.normalize(
        path.resolve(app.getAppPath(), isDev() ? "." : "..", "src", "assets"),
    );
}

export const getDBPath = () => {
    if (isDev()) return ":memory:"

    if (isTest()) return ":memory:"

    return path.join(app.getPath('documents'), "bear-budgets.db");
}