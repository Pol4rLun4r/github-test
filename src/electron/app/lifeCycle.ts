// electron
import { app } from "electron";

// database
import type { Database } from "better-sqlite3";

type GetDatabase = () => Database | undefined;

/** Configura o ciclo de vida do aplicativo */
export const setupAppLifeCycle = (getDB: GetDatabase) => {

    // garante que o banco de dados seja fechado corretamente quando o aplicativo for encerrado
    app.on("before-quit", () => {
        try {
            getDB()?.close();
        } catch (error) {
            console.error("Error closing database:", error);
        }
    });

    // captura erros não tratados para evitar que o aplicativo trave e para facilitar a depuração
    process.on('uncaughtException', console.error);
    process.on('unhandledRejection', console.error);
}