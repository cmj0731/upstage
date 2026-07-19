export const SOUTH_KOREA_COST_INDEX = 61.6;

const costOfLivingIndices: Record<string, number> = {
  Austria: 71.3,
  Belgium: 68.6,
  Brazil: 30.1,
  Canada: 63.0,
  Denmark: 78.9,
  Ecuador: 30.9,
  Finland: 69.0,
  France: 67.7,
  Germany: 68.7,
  "Hong Kong": 75.2,
  Italy: 61.4,
  Singapore: 87.7,
  Taiwan: 49.7,
  "United Kingdom": 67.8,
  "United States": 68.8,
};

function normalizeCountry(country: string): string {
  const normalized = country.trim().toLowerCase();
  const aliases: Record<string, string> = {
    uk: "united kingdom",
    usa: "united states",
    "hong kong sar": "hong kong",
    "hong kong (china)": "hong kong",
    brasil: "brazil",
  };
  return aliases[normalized] ?? normalized;
}

export function costOfLivingIndex(country: string): number | undefined {
  const target = normalizeCountry(country);
  return Object.entries(costOfLivingIndices).find(([name]) => normalizeCountry(name) === target)?.[1];
}
