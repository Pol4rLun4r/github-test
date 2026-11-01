// electron
import { shell, type BrowserWindow } from "electron";

// utils
import { isDev } from "../utils/env.js";

// função para lidar com links externos e evitar que o app navegue para fora do conteúdo interno
const openExternalIfNeeded = (url: string) => {
    // Deixa o app navegar normalmente em recursos internos
    if (url.startsWith("file:")) return false;
    if (isDev() && url.startsWith("http://localhost:5173/")) return false;

    // Abre links externos no navegador padrão
    if (url.startsWith("http:") || url.startsWith("https:") || url.startsWith("mailto:")) {
        void shell.openExternal(url);
        return true;
    }

    return false;
};

/** Configura as proteções de navegação para a janela principal */
export const setupWindowNavigationGuards = (win: BrowserWindow) => {

    // Impede que target="_blank" crie uma "aba/janela" dentro do Electron
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (openExternalIfNeeded(url)) return { action: "deny" };
        return { action: "allow" };
    });

    // Impede navegação da janela principal para fora do app
    win.webContents.on("will-navigate", (event, url) => {
        if (openExternalIfNeeded(url)) {
            event.preventDefault();
        }
    });
}
