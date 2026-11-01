// electron
import { BrowserWindow, Menu, MenuItem } from "electron";

// utils
import { isDev, isTestDatabase } from "../utils/env.js";
import { getPreloadPath, getUIPath } from "../utils/pathResolver.js";

// windows
import { setupWindowNavigationGuards } from "./navigation.js";

/** Função para criar a janela principal do aplicativo */
export const createMainWindow = () => {
    const win = new BrowserWindow({
        // segurança
        webPreferences: {
            nodeIntegration: false, // desativa a integração do Node.js para segurança
            sandbox: true, // necessário para contextBridge funcionar corretamente
            preload: getPreloadPath(), // caminho para o arquivo preload, que é responsável por expor as APIs do Electron para o renderer process de forma segura
            devTools: isDev() || isTestDatabase(),
            spellcheck: true
        },

        // style da janela
        width: 1200,
        height: 800,
        minWidth: 750,
        minHeight: 650,
        frame: false
    });

    // configura as proteções de navegação para a janela principal
    setupWindowNavigationGuards(win);

    if (isDev()) {
        win.loadURL('http://localhost:5173/'); // interface no modo desenvolvimento
    } else {
        win.loadFile(getUIPath()); // interface no modo produção (build)
    }

    // configura o idioma do corretor ortográfico após abrir a janela
    win.webContents.on('did-finish-load', () => {
        win.webContents.session.setSpellCheckerLanguages(['pt-BR', 'en-US']);
    });

    // configuração para aparecer o menu ao clicar com o botão direito
    win.webContents.on('context-menu', (_event, params) => {
        const menu = new Menu();

        // adiciona sugestões de correção ortográfica se a palavra estiver errada
        if (params.misspelledWord) {
            for (const suggestion of params.dictionarySuggestions) {
                menu.append(new MenuItem({
                    label: suggestion,
                    click: () => win.webContents.replaceMisspelling(suggestion)
                }));
            }

            menu.append(new MenuItem({ type: 'separator' }));
        }

        // opções padrão (Recortar, Copiar, Colar) em campos editáveis
        if (params.isEditable) {
            menu.append(new MenuItem({ label: 'Recortar', role: 'cut' }));
            menu.append(new MenuItem({ label: 'Copiar', role: 'copy' }));
            menu.append(new MenuItem({ label: 'Colar', role: 'paste' }));
            menu.popup();
        }

        return win;
    });
}

/** Função para focar ou criar a janela principal */
export const focusOrCreateMainWindow = () => {
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
}