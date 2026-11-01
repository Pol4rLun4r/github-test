// função para verificar se o ambiente é de desenvolvimento
export const isDev = (): boolean => {
    return process.env.NODE_ENV === 'development'
};

// função para verificar se o ambiente é de teste
export const isTest = (): boolean => {
    return process.env.NODE_ENV === 'test'
};

// função para verificar se o ambiente é de testes para um banco de dados real
export const isTestDatabase = (): boolean => {
    return process.env.NODE_ENV === 'database'
};