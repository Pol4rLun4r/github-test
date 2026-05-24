// utils
import { success, failure } from "../../utils/handleSuccess.js";
import { onlyName, onlyNumbers } from "../../utils/clean.js";

function identifyType(value: string): "number" | "letters" | "Invalid" {
    const cleanedNum = onlyNumbers(value);
    const cleanedText = onlyName(value);

    if (cleanedNum.length > 0 && !/[a-zà-ÿ]/i.test(value)) {
        return 'number'; 
    }

    if (cleanedText.length > 0 && !/\d/.test(value)) {
        return "letters";
    }

    return "Invalid";
};

const searchClientsRules = ({ type, value }: SearchClient) => {
    // check if is empty
    if (value.trim().length <= 0) {
        return failure('Nenhum valor informado')
    }

    // check type
    if (type !== 'name' && type !== 'document') {
        return failure('Por favor, especifique o tipo da busca')
    }

    // check if is invalid
    if (identifyType(value) === 'Invalid') {
        return failure("Busca inválida, não pode conter letras e números juntos")
    }

    // check if the type is document
    if (type === 'document') {

        // checks if value is number
        if (identifyType(value) === 'number') {
            return success(onlyNumbers(value), 'DOCUMENT');
        }

        return failure("Não use nomes para buscar um documento")
    }

    // checks if the type is name
    if (type === 'name') {

        // check if value is letters
        if (identifyType(value) === 'letters') {
            return success(onlyName(value), 'NAME');
        }

        return failure("Não use números para buscar um nome")
    }

    return failure("Não encontrado");
};

export default searchClientsRules;