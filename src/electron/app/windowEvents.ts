import { app } from "electron";

/* Eventos relacionados à janela do aplicativo, como ativação e fechamento de janelas. */
export const windowEvents = (restoreMainWindow: () => void) => {
    // foca ou restaura a janela principal quando o aplicativo é ativado
    app.on("activate", () => restoreMainWindow());
    
    // ao fechar todas as janelas encerra o programa
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
    });
;}