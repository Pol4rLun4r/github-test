// Converte uma string de data e hora em um objeto Date
export function parseSqliteLocalDatetime(s: string): Date {
    // "YYYY-MM-DD HH:MM:SS"
    const [datePart, timePart] = s.split(" ");
    const [y, m, d] = datePart.split("-").map(Number);
    const [hh, mm, ss] = timePart.split(":").map(Number);
    return new Date(y, m - 1, d, hh, mm, ss); // interpreta como horário local
}

// Converte uma string de data e hora em milissegundos
export function toMs(s: string): number {
    return parseSqliteLocalDatetime(s).getTime();
}