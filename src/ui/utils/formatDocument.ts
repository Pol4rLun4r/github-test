export const formatDocument = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');

  if (cleaned.length === 11) {
    // CPF
    return cleaned.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      '$1.$2.$3-$4'
    );
  }

  if (cleaned.length === 14) {
    // CNPJ
    return cleaned.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5'
    );
  }

  return value; // retorna original se não for válido
};