// Utility functions for document validation

// Main function to validate CPF or CNPJ
export const validateDocument = (document: string): boolean => {
    if(document === null || document === undefined) return false;

    // Remove all non-digit characters
    const cleanDoc = document.replace(/\D/g, '');

    // Check if it's CPF (11 digits) or CNPJ (14 digits)
    if (cleanDoc.length === 11) {
        return validateCPF(cleanDoc);
    } else if (cleanDoc.length === 14) {
        return validateCNPJ(cleanDoc);
    }

    return false;
};

// CPF validation
const validateCPF = (cpf: string): boolean => {
    // Check if all digits are the same
    if (/^(\d)\1+$/.test(cpf)) return false;

    // Calculate first check digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf[i]) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(cpf[9])) return false;

    // Calculate second check digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf[i]) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(cpf[10])) return false;

    return true;
};

// CNPJ validation
const validateCNPJ = (cnpj: string): boolean => {
    // Check if all digits are the same
    if (/^(\d)\1+$/.test(cnpj)) return false;

    // Calculate first check digit
    let sum = 0;
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    for (let i = 0; i < 12; i++) {
        sum += parseInt(cnpj[i]) * weights1[i];
    }
    let remainder = sum % 11;
    if (remainder < 2) remainder = 0;
    else remainder = 11 - remainder;
    if (remainder !== parseInt(cnpj[12])) return false;

    // Calculate second check digit
    sum = 0;
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    for (let i = 0; i < 13; i++) {
        sum += parseInt(cnpj[i]) * weights2[i];
    }
    remainder = sum % 11;
    if (remainder < 2) remainder = 0;
    else remainder = 11 - remainder;
    if (remainder !== parseInt(cnpj[13])) return false;

    return true;
};