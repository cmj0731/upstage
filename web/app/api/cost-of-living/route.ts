import { NextResponse } from "next/server";

const OECD_COUNTRIES = "KOR+AUT+BEL+CAN+DNK+FIN+FRA+DEU+ITA+GBR+USA";

type CsvRow = {
  REF_AREA?: string;
  TIME_PERIOD?: string;
  OBS_VALUE?: string;
};

function parseCsv(text: string): CsvRow[] {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift()?.split(",") ?? [];
  return lines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, values[index]])) as CsvRow;
  });
}

export async function GET() {
  const currentYear = new Date().getUTCFullYear();
  const startPeriod = `${currentYear - 1}-01`;
  const url = `https://sdmx.oecd.org/public/rest/data/OECD.SDD.TPS,DSD_PPP_M@DF_PP_CPL_M,1.0/${OECD_COUNTRIES}.M.CPL.IX.KRW.KOR?startPeriod=${startPeriod}&dimensionAtObservation=AllDimensions`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "text/csv" },
      next: { revalidate: 86400 },
    });
    if (!response.ok) throw new Error(`OECD ${response.status}`);

    const rows = parseCsv(await response.text());
    const period = rows.map((row) => row.TIME_PERIOD ?? "").sort().at(-1);
    if (!period) throw new Error("OECD period missing");

    const indices = Object.fromEntries(
      rows
        .filter((row) => row.TIME_PERIOD === period && row.REF_AREA && Number.isFinite(Number(row.OBS_VALUE)))
        .map((row) => [row.REF_AREA as string, Number(row.OBS_VALUE)]),
    );
    if (Object.keys(indices).length < 11) throw new Error("OECD rows missing");

    return NextResponse.json(
      { source: "OECD", period, base: "Korea=100", indices },
      { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } },
    );
  } catch {
    return NextResponse.json({ error: "OECD 물가지수를 불러오지 못했습니다." }, { status: 502 });
  }
}
