/**
 * valida se um valor é um numero inteiro seguro e positivo.
 *
 * @param value valor a ser validado. Pode ser qualquer tipo, mas normalmente vem de um numero.
 * @returns `true` quando o valor for um número inteiro seguro maior que zero; caso contrário, retorna `false`.
 *
 * isso é útil para garantir que IDs usados em consultas ou operações de banco sejam válidos.
 */
const isValidPositiveInteger = (value: number | undefined): value is number =>
    Number.isSafeInteger(value) && value! > 0;

const helpers = {
    isValidPositiveInteger
}

export default helpers;