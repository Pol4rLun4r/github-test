export const isDefinedNonNegative = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;

  const n = Number(value);
  return Number.isFinite(n) && n > 0;
};

export const isDefinedMarkup = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;

  return Number.isFinite(Number(value));
};
