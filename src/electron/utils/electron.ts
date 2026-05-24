import path from "path";
import electron, { WebFrameMain } from "electron";
import { fileURLToPath } from "url";

// utils
import { isDev } from "./env.js";
import { getUIPath } from "./pathResolver.js";

// tirar # e ? porque o Electron devolve por vezes .../index.html#/… e antes eu comparava string a string → IPC sempre “Malicious event” na prod
const frameTopDocumentPath = (frameUrlStr: string) => {
    const base = frameUrlStr.split(/[#?]/)[0] ?? frameUrlStr;
    return path.normalize(fileURLToPath(base));
};

// função para verificar se o webFrame é o correto, para evitar ataques maliciosos
export function validateEventFrame(frame: WebFrameMain) {
    if (isDev()) {
        try {
            const { host } = new URL(frame.url);
            if (host === "localhost:5173") return;
        } catch {
            /* compara pelo ficheiro abaixo */
        }
    }
    const ui = path.normalize(getUIPath());
    let senderPath: string;
    try {
        senderPath = frameTopDocumentPath(frame.url);
    } catch {
        throw new Error("Malicious event");
    }
    // no Windows dois paths equivalentes não batem por maiúsculas no drive — já me queimou nos invokes
    const same =
        process.platform === "win32"
            ? senderPath.toLowerCase() === ui.toLowerCase()
            : senderPath === ui;
    if (!same) {
        throw new Error("Malicious event");
    }
}

// função para lidar com eventos do ipcMain, garantindo que o evento seja legítimo e passando o banco de dados para a função de manipulação
export const ipcMainHandle = <Key extends keyof EventPayloadMapping>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    channels: Key, handle: (args: any) => EventPayloadMapping[Key]
) => {
    electron.ipcMain.handle(channels, (event, args) => {
        if (!event.senderFrame) {
            throw new Error('Malicious event');
        }
        validateEventFrame(event.senderFrame);
        return handle(args);
    });
};