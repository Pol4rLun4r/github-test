import { BrowserWindow, ipcMain, type WebContents } from "electron";

// utils
import { validateEventFrame } from "../utils/electron.js";

// função para obter a janela a partir do sender
const targetWindowFrom = (sender: WebContents) =>
    BrowserWindow.fromWebContents(sender);

// função para lidar com eventos de janela de forma segura
const safeHandle = <Key extends keyof EventPayloadMapping>(
    channel: Key,
    run: (win: BrowserWindow) => void,
) => {
    ipcMain.handle(channel, (event) => {
        if (!event.senderFrame) {
            throw new Error("Malicious event");
        }
        validateEventFrame(event.senderFrame);
        const win = targetWindowFrom(event.sender);
        if (win) run(win);
    });
};

const windowHandlers = () => {
    safeHandle("window:minimize", (win) => win.minimize());

    safeHandle("window:maximizeToggle", (win) => {
        if (win.isMaximized()) win.unmaximize();
        else win.maximize();
    });

    safeHandle("window:close", (win) => win.close());
};

export default windowHandlers;
