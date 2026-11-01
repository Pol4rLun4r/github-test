/// <reference types="vitest/globals" />

// database, service and repo
import { createDatabase } from "../../db/connection.js";
import { createRepositories } from "../../repositories/index.js";
import { createServices } from "../../services/index.js";

// utils
import { getDBPath } from "../../utils/pathResolver.js"

/** cria contexto para testes com banco de dados, serviços e repositórios */
const createTestContext = () => {
    const db = createDatabase(getDBPath());

    return {
        db,
        repositories: createRepositories(db),
        services: createServices(db),
        close: () => db.close(),
    };
}

export default createTestContext;