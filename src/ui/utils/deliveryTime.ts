import {
    differenceInCalendarDays,
    getDeliveryDate,
} from "../features/budget/itemForm/components/ItemValues/inputs/Boarding/boardingUtils";

export interface DeliveryTime {
    totalCalendarDays: number;
    deliveryDate: Date;
}

/**
 * Calcula o prazo total em dias corridos e a data de entrega.
 * O embarque é contado em dias corridos; a entrega, em dias úteis.
 */
export function getDeliveryTime(
    baseDate: Date,
    boardingCalendarDays: number,
    deliveryBusinessDays: number,
): DeliveryTime {
    const deliveryDate = getDeliveryDate(
        baseDate,
        boardingCalendarDays,
        deliveryBusinessDays,
    );

    return {
        totalCalendarDays: differenceInCalendarDays(baseDate, deliveryDate),
        deliveryDate,
    };
}
