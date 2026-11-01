type listStructure = {
    label: string;
    value: string;
}

export const markupList: listStructure[] = [
    { label: '(00%) Zero', value: '0' },
    { label: '(05%) Markup', value: '5' },
    { label: '(10%) Markup', value: '10' },
    { label: '(15%) Markup', value: '15' },
    { label: '(20%) Markup', value: '20' },
    { label: '(25%) Markup', value: '25' },
    { label: '(30%) Markup', value: '30' },
    { label: '(35%) Markup', value: '35' },
    { label: '(40%) Markup ', value: '40' },
    { label: '(45%) Markup', value: '45' },
    { label: '(50%) Markup', value: '50' },
    { label: '(55%) Markup', value: '55' },
    { label: '(60%) Markup', value: '60' },
    { label: '(65%) Markup', value: '65' },
    { label: '(70%) Markup', value: '70' },
    { label: '(75%) Markup', value: '75' },
    { label: '(80%) Markup', value: '80' },
    { label: '(85%) Markup', value: '85' },
    { label: '(90%) Markup', value: '90' },
    { label: '(95%) Markup', value: '95' },
    { label: '(100%) Markup', value: '100' },
    { label: '(150%) Markup', value: '150' },
    { label: '(200%) Markup', value: '200' },
];

export const convertMarkupValue = (value: string | undefined): number => {
    if (value === undefined) return 0
    if (value === null) return 0
    const parts = value.split('.');
    const numStr = parts[0];
    return parseInt(numStr, 10);
}