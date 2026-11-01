import { useState } from "react";

// styles
import classes from "./Boarding.module.css";

// dayjs
import dayjs from "dayjs";

// mantine
import { NumberInput, Select, Group } from "@mantine/core";
import { DateInput } from '@mantine/dates';

// utils
import { addCalendarDays, differenceInCalendarDays, businessDaysToCalendarDays, calendarDaysToBusinessDays, parsePastedDate } from "./boardingUtils";
import { IconCalendar } from "@tabler/icons-react";

type BoardingInputMode =
    | 'calendarDays'
    | 'businessDays'
    | 'date';

interface BoardingInputProps {
    baseDate: Date;
    value: number;
    onChange: (value: number) => void;
}

const BoardingInput = ({ baseDate, value, onChange }: BoardingInputProps) => {

    const [mode, setMode] = useState<BoardingInputMode>('calendarDays');

    const styleConfig = {
        input: classes['boarding-number-input'],
    }
    const configInputs = { leftSection: <IconCalendar size={18} />, w: '50%', radius: 'lg', label: 'Embarque', classNames: { ...styleConfig } };

    return (
        <Group gap="0" flex={1} align="flex-end">
            {mode === 'calendarDays' && (
                <NumberInput
                    {...configInputs}
                    placeholder="corridos"
                    min={0}
                    value={value}
                    onChange={(value) => {
                        if (typeof value === 'number') {
                            onChange(value)
                        }
                    }}
                />
            )}

            {mode === 'businessDays' && (
                <NumberInput
                    {...configInputs}
                    placeholder="úteis"
                    min={0}
                    value={calendarDaysToBusinessDays(baseDate, value)}
                    onChange={(businessDays) => {
                        if (typeof businessDays === 'number') {
                            const calendarDays = businessDaysToCalendarDays(
                                baseDate,
                                businessDays
                            );

                            onChange(calendarDays);
                        }
                    }}
                />
            )}

            {mode === 'date' && (
                <DateInput
                    {...configInputs}
                    placeholder="DD/MM/AAAA"
                    valueFormat="DD/MM/YYYY"
                    minDate={dayjs(baseDate).startOf('day').toDate()}
                    value={dayjs(addCalendarDays(baseDate, value)).format('YYYY-MM-DD')}
                    onChange={(date) => {
                        if (!date) return;

                        const selectedDate = dayjs(date, 'YYYY-MM-DD').toDate();

                        const calendarDays = differenceInCalendarDays(
                            baseDate,
                            selectedDate
                        );

                        onChange(calendarDays);
                    }}
                    onPaste={(event) => {
                        const pastedText = event.clipboardData.getData('text');

                        const selectedDate = parsePastedDate(pastedText);

                        if (!selectedDate) {
                            return;
                        }

                        event.preventDefault();

                        const calendarDays = differenceInCalendarDays(
                            baseDate,
                            selectedDate
                        );

                        onChange(calendarDays);
                    }}
                />
            )}
            <Select
                w={'50%'}
                radius={'lg'}
                withAlignedLabels
                allowDeselect={false}
                value={mode}
                onChange={(value) => setMode(value as BoardingInputMode)}
                data={[
                    { label: 'D/ corridos', value: 'calendarDays' },
                    { label: 'D/ úteis', value: 'businessDays' },
                    { label: 'Calendário', value: 'date' },
                ]}

                classNames={{
                    input: classes['boarding-select-input'],
                }}
            />
        </Group>
    )
}

export default BoardingInput