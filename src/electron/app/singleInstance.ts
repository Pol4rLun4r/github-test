// electron
import { app } from "electron";

/** Configura o modo de instância única para o aplicativo */
export const setupSingleInstance = (onSecondInstance: () => void) => {
    
    // verifica se o programa já está sendo executado em outra instância
    const gotLock = app.requestSingleInstanceLock();

    // se não conseguiu obter o lock, significa que outra instância já está rodando, então fecha a nova instância
    if (!gotLock) {
        app.quit();
        return false;
    }

    // se o programa já estiver sendo executado, foca a janela existente
    app.on("second-instance", () => onSecondInstance());
    return true;
}