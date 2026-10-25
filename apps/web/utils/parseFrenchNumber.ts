export function parseFrenchFloat(rawValue: string): number {
  const normalizedValue = rawValue
    .replace(/\u00a0/g, "")
    .replace(/\s+/g, "")
    .replace(/€/g, "")
    .replace(/%/g, "")
    .replace(/\/Part/gi, "")
    .replace(",", ".")
    .trim();

  const parsedNumber = Number.parseFloat(normalizedValue);
  return Number.isNaN(parsedNumber) ? 0 : parsedNumber;
}

export function parseFrenchInt(rawValue: string): number {
  const normalizedValue = rawValue
    .replace(/\u00a0/g, "")
    .replace(/\s+/g, "")
    .replace(/[^\d-]/g, "")
    .trim();

  const parsedInteger = Number.parseInt(normalizedValue, 10);
  return Number.isNaN(parsedInteger) ? 0 : parsedInteger;
}
