// electron
import { app } from "electron";

// utils
import { getDBPath } from "./utils/pathResolver.js";
import { createFakeData } from "./utils/createFakeData.js";

// database
import { createDatabase } from "./db/connection.js";

// electron components
import ipcHandlers from "./ipc/index.js";

// windows
import { windowEvents } from "./app/windowEvents.js";
import { createMainWindow, focusOrCreateMainWindow } from "./windows/mainWindow.js";

// setups
import { setupSingleInstance } from "./app/singleInstance.js";
import { setupAppLifeCycle } from "./app/lifeCycle.js";

// database
let db: ReturnType<typeof createDatabase> | undefined;

const main = () => {
    // configura o ciclo de vida do aplicativo, garantindo que o banco de dados seja fechado corretamente e capturando erros não tratados
    setupAppLifeCycle(() => db);

    // garante que só uma instancia do app roda, se o usuário tentar abrir outra, a janela da instância existente é focada
    if (!setupSingleInstance(focusOrCreateMainWindow)) {
        return;
    }

    // quando o app estiver pronto, cria a janela principal, inicializa o banco de dados e registra os handlers do IPC
    app.whenReady().then(() => {
        db = createDatabase(getDBPath()); // cria a conexão com o banco de dados

        // função para dev
        createFakeData(db); // cria dados fake em modo de desenvolvimento

        // funções principais do app
        ipcHandlers(db); // registo dos handlers antes de abrir a janela
        windowEvents(focusOrCreateMainWindow); // registo dos eventos da janela
        createMainWindow(); // cria a janela principal do aplicativo
    })
}

main();