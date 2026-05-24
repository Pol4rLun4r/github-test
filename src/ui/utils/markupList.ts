type listStructure = {
    label: string;
    value: string;
}

export const markupList: listStructure[] = [
    { label: '(40%) Visolight', value: '40.1' },
    { label: '(50%) Visolight Plus', value: '40.2' },
    { label: '(25%) Fabricante', value: '25' },
    { label: '(40%) Revenda ICMS 12%', value: '40.3' },
    { label: '(35%) Revenda ICMS 7%', value: '35' },
    { label: '(30%) Revenda ICMS 4%', value: '30' },
    { label: '(00%) Zero', value: '0' },
    { label: '(40%) Rockwell / Allen', value: '40.4' },
    { label: '(45%) Mercado livre fora de sp', value: '45.1' },
    { label: '(40%) Mercado livre dentro de sp', value: '40.5' },
    { label: '(35%) Telbra', value: '35.1' },
];

export const convertMarkupValue = (value: string | undefined): number => {
    if(value === undefined) return 0
    if(value === null) return 0
    const parts = value.split('.');
    const numStr = parts[0];
    return parseInt(numStr, 10);
}