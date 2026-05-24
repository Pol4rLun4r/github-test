import { app } from "electron";

const appEvents = (restoreMainWindow: () => void) => {
    app.on("activate", () => restoreMainWindow());
    
    // ao fechar todas as janelas encerra o programa
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
    });
}

export default appEvents;
