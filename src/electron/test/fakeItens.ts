export const fakeItemVersion = (
  position: number,
  overrides: Partial<ItemVersion> = {},
): Partial<ItemVersion> => ({
  quantity: 2,
  unit_price: 2,
  position,
  ...overrides,
});

export const fakeItens = [
  {
    description: "Cabo flexível 2,5mm 750V azul",
    internal_code: "INT-EL-001",
    manufacturer_code: "FAB-CAB-250-AZ",
    ncm: "85444900",
    notes: "Uso em quadros elétricos",
  },
  {
    description: "Cabo flexivel 2.5 mm 750V preto",
    internal_code: "INT-EL-002",
    manufacturer_code: "FAB-CAB-250-PT",
    ncm: "85444900"
  },
  {
    description: "Cabo rígido 4mm 750V vermelho",
    internal_code: "INT-EL-003",
    manufacturer_code: "FAB-CAB-400-VM",
    ncm: "85444900"
  },
  {
    description: "Cabo rigido 4 mm 750V verde",
    internal_code: "INT-EL-004",
    manufacturer_code: "FAB-CAB-400-VD",
    ncm: "85444900"
  },
  {
    description: "Porca M8 3 x 4 mm zincada",
    internal_code: "INT-EL-005",
    manufacturer_code: "FAB-POR-M8-34-ZN",
    ncm: "73181600"
  },
  {
    description: "Porca 3 x 4 mm zincada",
    internal_code: "INT-EL-006",
    manufacturer_code: "FAB-POR-34-ZN",
    ncm: "73181600"
  },
  {
    description: "Porca M8 3x4mm inox",
    internal_code: "INT-EL-007",
    manufacturer_code: "FAB-POR-M8-34-IN",
    ncm: "73181600"
  },
  {
    description: "Lâmpada infravermelho 250W 220V",
    internal_code: "INT-EL-008",
    manufacturer_code: "FAB-LMP-INF-250-220",
    ncm: "85394900"
  },
  {
    description: "Lampada infravermelha 250 W 127V",
    internal_code: "INT-EL-009",
    manufacturer_code: "FAB-LMP-INF-250-127",
    ncm: "85394900"
  },
  {
    description: "Lâmpada infravermelho 150W 220V",
    internal_code: "INT-EL-010",
    manufacturer_code: "FAB-LMP-INF-150-220",
    ncm: "85394900"
  },
  {
    description: "Resistência infravermelha 1000W 220V",
    internal_code: "INT-EL-011",
    manufacturer_code: "FAB-RES-INF-1000-220",
    ncm: "85168000"
  },
  {
    description: "Resistencia infravermelha 1000 W 127V",
    internal_code: "INT-EL-012",
    manufacturer_code: "FAB-RES-INF-1000-127",
    ncm: "85168000"
  },
  {
    description: "Disjuntor bipolar 20A curva C",
    internal_code: "INT-EL-013",
    manufacturer_code: "FAB-DIS-2P-20-C",
    ncm: "85362000"
  },
  {
    description: "Disjuntor bi polar 25A curva C",
    internal_code: "INT-EL-014",
    manufacturer_code: "FAB-DIS-2P-25-C",
    ncm: "85362000"
  },
  {
    description: "Disjuntor monopolar 20A curva B",
    internal_code: "INT-EL-015",
    manufacturer_code: "FAB-DIS-1P-20-B",
    ncm: "85362000"
  },
  {
    description: "Tomada 2P+T 10A branca",
    internal_code: "INT-EL-016",
    manufacturer_code: "FAB-TOM-2PT-10-BR",
    ncm: "85366910"
  },
  {
    description: "Tomada 2P + T 20A branca",
    internal_code: "INT-EL-017",
    manufacturer_code: "FAB-TOM-2PT-20-BR",
    ncm: "85366910"
  },
  {
    description: "Tomada 2P+T 10A preta",
    internal_code: "INT-EL-018",
    manufacturer_code: "FAB-TOM-2PT-10-PT",
    ncm: "85366910"
  }
];