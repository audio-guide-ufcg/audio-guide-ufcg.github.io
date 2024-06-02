import { TuristPoint, Coords } from "@/services/types";

const backendUrl = "https://audio-guide-api.fly.dev/";

export async function getLocationsFromBackend(): Promise<TuristPoint[]> {
  const response = await fetch(backendUrl + "api/points");
  
  if (!response.ok) {
    throw new Error("Failed to fetch locations from the backend");
  }

  const data = await response.json();

  return data.map((location: any) => {
    return {
      id: location.id,
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address || "",
      entryPrice: location.entry_price || 0,
      type: location.type || "",
      language: location.language || "pt",
      email: location.email || "",
      telephone: location.telephone || "",
    };
  });
}

export async function getFullLocationsData(
  pontos: TuristPoint[]
): Promise<TuristPoint[]> {
  const fullPontos = pontos.map((ponto: any) => {
    return getFullLocationData(ponto);
  });

  return Promise.all(fullPontos);
}

async function getFullLocationData(ponto: TuristPoint): Promise<TuristPoint> {
  const response = await fetch(`${backendUrl}api/points/${ponto.id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch locations from the backend");
  }

  const data = await response.json();

  return {
    id: data.id,
    name: data.name,
    latitude: data.latitude,
    longitude: data.longitude,
    address: data.address || "",
    entryPrice: data.entry_price || 0,
    type: data.type || "",
    tags: data.tags || [],
    transcript: data.transcript || "",
    images: data.images || [],
    audio:
      {
        path: data.audio.id,
        duration: data.audio.duration,
        language: data.audio.language,
      } || "",
    language: data.language || "pt",
    email: data.email || "",
    telephone: data.telephone || "",
    shouldContact: data.should_contact,
    day1: data.day1,
    day2: data.day2,
    day3: data.day3,
    day4: data.day4,
    day5: data.day5,
    day6: data.day6,
    day7: data.day7,
  };
}

export function distanceBetweenCoords(coords1: Coords, coords2: Coords) {
  var R = 6671.7103; // Raio da terra em kilometros. Valor levemente alterado para cima para fazer com que o resultado da função seja artificialmente maior.
  var rlat1 = coords1.latitude * (Math.PI / 180);
  var rlat2 = coords2.latitude * (Math.PI / 180);
  var difflat = rlat2 - rlat1;
  var difflon = (coords2.longitude - coords1.longitude) * (Math.PI / 180);
  var d =
    2 *
    R *
    Math.asin(
      Math.sqrt(
        Math.sin(difflat / 2) * Math.sin(difflat / 2) +
          Math.cos(rlat1) *
            Math.cos(rlat2) *
            Math.sin(difflon / 2) *
            Math.sin(difflon / 2)
      )
    );
  return d;
}
