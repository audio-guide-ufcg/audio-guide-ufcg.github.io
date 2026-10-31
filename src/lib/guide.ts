import recoveredCatalog from "@/data/recovered-catalog.json";
export type Language = "pt" | "en";
export type Point = {
  id: number;
  source?: "recovered";
  locationNeedsReview?: boolean;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  address: string;
  entryPrice: number | null;
  accessible: boolean | null;
  rating: number;
  tags: string[];
  images: { url: string; credits: string }[];
  audio: string | null;
  transcript: string;
  language: string;
  email: string;
  telephone: string;
  shouldContact: boolean;
  hours: string[];
};
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(
  /\/$/,
  "",
);
const IMAGE_URL = (
  process.env.NEXT_PUBLIC_IMAGE_URL || "https://image-store-five.vercel.app"
).replace(/\/$/, "");
const AUDIO_URL = (
  process.env.NEXT_PUBLIC_AUDIO_URL || "https://audio-store-roan.vercel.app"
).replace(/\/$/, "");
const text = (v: unknown) => (typeof v === "string" ? v : "");
const number = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) ? v : null;
export function normalizePoint(value: unknown): Point {
  if (!value || typeof value !== "object") throw new Error("Ponto inválido");
  const p = value as Record<string, any>;
  if (
    number(p.id) === null ||
    number(p.latitude) === null ||
    number(p.longitude) === null
  )
    throw new Error("Ponto sem identificação ou coordenadas");
  return {
    id: p.id,
    name: text(p.name) || "Sem nome",
    type: text(p.type) || "Outros",
    latitude: p.latitude,
    longitude: p.longitude,
    address: text(p.address),
    entryPrice: number(p.entry_price),
    accessible: typeof p.accessible === "boolean" ? p.accessible : null,
    rating: number(p.rating) || 0,
    tags: Array.isArray(p.tags)
      ? p.tags.filter((v: unknown) => typeof v === "string")
      : [],
    images: Array.isArray(p.images)
      ? p.images
          .filter((i: any) => i && typeof i.id === "string")
          .map((i: any) => ({
            url: `${IMAGE_URL}/${encodeURIComponent(i.id)}.jpg`,
            credits: text(i.credits),
          }))
      : [],
    audio: p.audio?.id
      ? `${AUDIO_URL}/${encodeURIComponent(p.audio.id)}.mp3`
      : null,
    transcript: text(p.transcript?.text),
    language: text(p.language) || "pt",
    email: text(p.email),
    telephone: text(p.telephone),
    shouldContact: !!p.should_contact,
    hours: Array.from({ length: 7 }, (_, i) => text(p[`day${i + 1}`])),
  };
}
export async function request(
  path: string,
  signal?: AbortSignal,
  body?: unknown,
) {
  if (!API_URL) throw new Error("API não configurada");
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted) abort();
  signal?.addEventListener("abort", abort, { once: true });
  const timer = setTimeout(abort, 10000);
  try {
    const response = await fetch(`${API_URL}/api/${path}`, {
      signal: controller.signal,
      ...(body
        ? {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        : {}),
    });
    if (!response.ok)
      throw new Error(
        `Não foi possível completar a solicitação (${response.status}).`,
      );
    return await response.json();
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abort);
  }
}
export async function loadPoints(
  language: Language,
  signal?: AbortSignal,
): Promise<Point[]> {
  const data = await request(`points?language=${language}`, signal);
  if (!Array.isArray(data)) throw new Error("Resposta de pontos inválida");
  return data.map(normalizePoint);
}
export async function loadPoint(
  id: number,
  language: Language,
  signal?: AbortSignal,
): Promise<Point> {
  if (!Number.isSafeInteger(id) || id <= 0)
    throw new Error("ID local não pode ser enviado à API");
  return normalizePoint(
    await request(`points/${id}?language=${language}`, signal),
  );
}
export const fold = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
export function distance(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
) {
  const rad = Math.PI / 180;
  const h =
    Math.sin(((b.latitude - a.latitude) * rad) / 2) ** 2 +
    Math.cos(a.latitude * rad) *
      Math.cos(b.latitude * rad) *
      Math.sin(((b.longitude - a.longitude) * rad) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(h)));
}
export function openingStatus(
  p: Pick<Point, "shouldContact" | "hours">,
  now = new Date(),
): "open" | "closed" | "unknown" {
  if (p.shouldContact || p.hours.every((h) => !h)) return "unknown";
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Fortaleza",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value || "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
    get("weekday"),
  );
  const minute = Number(get("hour")) * 60 + Number(get("minute"));
  const parse = (v: string) =>
    v.split(",").flatMap((interval) => {
      const match = interval
        .trim()
        .match(/^(\d{2}):(\d{2})\s*[-–]\s*(\d{2}):(\d{2})$/);
      return match
        ? [[+match[1] * 60 + +match[2], +match[3] * 60 + +match[4]]]
        : [];
    });
  if (
    parse(p.hours[day] || "").some(([start, end]) =>
      end > start ? minute >= start && minute < end : minute >= start,
    )
  )
    return "open";
  if (
    parse(p.hours[(day + 6) % 7] || "").some(
      ([start, end]) => end <= start && minute < end,
    )
  )
    return "open";
  return "closed";
}
export function price(value: number | null) {
  return value === null || value < 0
    ? "Consultar entrada"
    : value === 0
      ? "Gratuito"
      : value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
export const demoPoints: Point[] = ["Cultura", "Ao ar livre", "História"].map(
  (type, i) => ({
    id: i + 1,
    name: `Ponto de exemplo ${i + 1}`,
    type,
    latitude: -7.2218 + i * 0.004,
    longitude: -35.8893 + i * 0.003,
    address: "Localização ilustrativa em Campina Grande",
    entryPrice: i === 1 ? 10 : 0,
    accessible: i !== 2,
    rating: 0,
    tags: ["Demonstração"],
    images: [],
    audio: "/demo/recovered.mp3",
    transcript:
      "Este é um ponto fictício para experimentar a interface. O áudio é um arquivo recuperado do projeto, ainda sem vínculo confirmado com um ponto turístico. Os dados reais serão exibidos quando o catálogo estiver disponível.",
    language: "pt",
    email: "",
    telephone: "",
    shouldContact: true,
    hours: Array(7).fill(""),
  }),
);

export const recoveredPoints: Point[] = recoveredCatalog.points.map((p) => ({
  ...p,
  source: "recovered",
}));
export const canRatePoint = (point: Point) =>
  point.source !== "recovered" &&
  Number.isSafeInteger(point.id) &&
  point.id > 0;
