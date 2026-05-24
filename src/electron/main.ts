import { app, BrowserWindow, shell } from "electron";

// utils
import { isDev } from "./utils/env.js";
import { getPreloadPath, getDBPath, getUIPath } from "./utils/pathResolver.js";
import { createFakeData } from "./utils/createFakeData.js";

// database
import { createDatabase } from "./db/connection.js";

// componentes
import ipcHandlers from "./ipc/index.js";
import appEvents from "./appEvents.js";

// criar janela principal
const createMainWindow = () => {
    const win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false, // desativa a integração do Node.js para segurança
            sandbox: true, // necessário para contextBridge funcionar corretamente
            preload: getPreloadPath(), // caminho para o arquivo preload, que é responsável por expor as APIs do Electron para o renderer process de forma segura
            devTools: isDev() ? true : false,
        },
        width: 1200,
        height: 800,
        minWidth: 750,
        minHeight: 650,
        frame: false
        
    });

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

    if (isDev()) {
        win.loadURL('http://localhost:5173/'); // caminho em desenvolvimento
    } else {
        // sempre o mesmo path que uso no validateEventFrame do IPC — evita inconsistência prod vs validação
        win.loadFile(getUIPath());
    }
};

// banco pode ainda não existir antes do whenReady / before-quit raro falhar no arranque
let db: ReturnType<typeof createDatabase> | undefined;

process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);

// função para focar ou criar a janela principal
const focusOrCreateMainWindow = () => {
    const wins = BrowserWindow.getAllWindows();
    if (wins.length === 0) {
        createMainWindow();
        return;
    }

    // foca ou cria a janela principal
    for (const win of wins) {
        if (win.isMinimized()) win.restore();
        win.show();
        win.focus();
    }
};


const main = () => {
    // verifica se o programa já está sendo executado em outra instância
    const gotLock = app.requestSingleInstanceLock();
    if (!gotLock) {
        app.quit();
        return;
    }
    // se o programa já está sendo executado em outra instância, foca ou cria a janela principal
    app.on("second-instance", () => focusOrCreateMainWindow());

    // fecha explicitamente pra soltar locks do sqlite (principalmente Win/Linux); sem isso ficava processo zombie e single-instance partia aos trambolhões
    app.on("before-quit", () => {
        try {
            db?.close();
        } catch {
            //
        }
    });

    try {
        app.whenReady().then(() => {
            db = createDatabase(getDBPath());

            // cria dados fake para desenvolvimento
            createFakeData(db);

            // registo dos handlers antes de abrir a janela — assim nenhum invoke dispara “meio a meio” sem listener
            ipcHandlers(db);
            appEvents(focusOrCreateMainWindow);
            createMainWindow();
        })
    } catch (error) {
        console.error(error);
        app.quit();
    }
}

main();