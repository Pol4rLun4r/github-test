import dayjs from 'dayjs';

/** verifica se uma data é um dia útil */
function isBusinessDay(date: Date): boolean {
    const day = dayjs(date).day();

    return day !== 0 && day !== 6;
}

/** adiciona dias corridos a uma data */
export function addCalendarDays(
    baseDate: Date,
    days: number
): Date {
    return dayjs(baseDate).add(days, 'day').toDate();
}

/** adiciona dias úteis a uma data */
export function addBusinessDays(
    baseDate: Date,
    days: number
): Date {
    let currentDate = dayjs(baseDate);
    let remainingDays = days;

    while (remainingDays > 0) {
        currentDate = currentDate.add(1, 'day');

        if (isBusinessDay(currentDate.toDate())) {
            remainingDays--;
        }
    }

    return currentDate.toDate();
}

/** calcula a data de entrega após os dias corridos de embarque e dias úteis de entrega */
export function getDeliveryDate(
    baseDate: Date,
    boardingDays: number,
    deliveryBusinessDays: number
): Date {
    const boardingDate = addCalendarDays(baseDate, boardingDays);

    return addBusinessDays(boardingDate, deliveryBusinessDays);
}

/** calcula a diferença em dias corridos entre duas datas */
export function differenceInCalendarDays(
    baseDate: Date,
    targetDate: Date
): number {
    return dayjs(targetDate).startOf('day')
        .diff(dayjs(baseDate).startOf('day'), 'day');
}

/** converte dias úteis para dias corridos */
export function businessDaysToCalendarDays(
    baseDate: Date,
    businessDays: number
): number {
    const targetDate = addBusinessDays(baseDate, businessDays);

    return differenceInCalendarDays(baseDate, targetDate);
}

/** converte dias corridos para dias úteis */
export function calendarDaysToBusinessDays(
    baseDate: Date,
    calendarDays: number
): number {
    const targetDate = addCalendarDays(baseDate, calendarDays);

    let currentDate = dayjs(baseDate);
    let businessDays = 0;

    while (currentDate.isBefore(targetDate, 'day')) {
        currentDate = currentDate.add(1, 'day');

        if (isBusinessDay(currentDate.toDate())) {
            businessDays++;
        }
    }

    return businessDays;
}

/** analisa uma data colada do clipboard e retorna a data normalizada ex: "01/01/2023" */
export function parsePastedDate(value: string): Date | null {
    const normalizedValue = value.trim().replace(/[.-]/g, '/');

    const match = normalizedValue.match(
        /^(\d{2})\/(\d{2})\/(\d{4})$/
    );

    if (!match) {
        return null;
    }

    const [, day, month, year] = match;

    const date = dayjs(`${year}-${month}-${day}`, 'YYYY-MM-DD');

    if (!date.isValid()) {
        return null;
    }

    return date.toDate();
}