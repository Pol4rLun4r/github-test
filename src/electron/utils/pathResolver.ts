import path from "path";
import { app } from "electron";

// utils
import { isDev, isTest, isTestDatabase } from "./env.js";

/** função para obter o caminho do arquivo de preload */
export const getPreloadPath = () => {
    const name = path.join("dist-electron", "preload.cjs");
    const resolved = app.isPackaged
        ? path.resolve(process.resourcesPath, name)
        : path.resolve(app.getAppPath(), name);
    return path.normalize(resolved);
};

/** função para obter o caminho do arquivo de UI */
export function getUIPath() {
    return path.normalize(
        path.resolve(app.getAppPath(), "dist-react", "index.html"),
    );
}

/** função para obter o caminho dos assets */
export function getAssetPath() {
    return path.normalize(
        path.resolve(app.getAppPath(), isDev() ? "." : "..", "src", "assets"),
    );
}

/** função para obter o caminho do banco de dados */
export const getDBPath = () => {
    if (isDev()) return ":memory:"

    if (isTest()) return ":memory:"

    if(isTestDatabase()) return path.join(app.getPath('documents'), "bear-budgets-test-database.db");

    return path.join(app.getPath('documents'), "bear-budgets.db");
}