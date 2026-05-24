/** Remove prefixo monetário e espaços extras antes do parse.  */
const cleaned = (text: string): string =>
    text
        .trim()
        .replace(/\u00A0/g, " ")
        .replace(/R\$\s*/gi, "")
        .trim();

/** Converte valores brasileiros (ex.: "R$ 3.339,00" ou "3339,00") em número que possa ser lido pelo js sem problemas  */
export const normalizeBrazilianCurrency = (text: string): number | undefined => {
    const trimmed = cleaned(text);
    if (!trimmed) return undefined;

    const lastComma = trimmed.lastIndexOf(",");
    let normalized: string;

    if (lastComma >= 0) {
        const intPart = trimmed
            .slice(0, lastComma)
            .replace(/\./g, "")
            .replace(/\s/g, "")
            .replace(/\D/g, "");
        const decPart = trimmed.slice(lastComma + 1).replace(/\D/g, "").slice(0, 2);
        if (!intPart && !decPart) return undefined;
        normalized = `${intPart || "0"}.${decPart.padEnd(2, "0")}`;
    } else {
        const digits = trimmed.replace(/\./g, "").replace(/\D/g, "");
        if (!digits) return undefined;
        normalized = digits;
    }

    const num = Number(normalized);
    return Number.isFinite(num) ? num : undefined;
};

/** Converte o valor informado para número monetário quando estiver usando o `onChange` */
export const convertToNumber = (value: string | number | undefined): number | undefined => {
    if (value === "" || value === undefined) return undefined;
    if (typeof value === "number") return value; // se for number, retornar o valor normal
    return normalizeBrazilianCurrency(value); // se for string, é convertida em um valor numérico tratado 
};