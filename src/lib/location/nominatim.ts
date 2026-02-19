export type LocationSuggestionSource = "nominatim" | "browser";

export interface LocationSuggestion {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  source: LocationSuggestionSource;
}

interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state?: string;
  country?: string;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
  address?: NominatimAddress;
}

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";
const DEFAULT_COUNTRY_CODES = "rw,ke,tz,ug,za,ng,gh";

function uniqueParts(parts: Array<string | undefined>): string[] {
  const seen = new Set<string>();
  const nextParts: string[] = [];

  for (const part of parts) {
    if (!part) continue;
    const value = part.trim();
    if (!value) continue;

    const key = value.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    nextParts.push(value);
  }

  return nextParts;
}

function toSuggestion(
  result: NominatimResult,
  source: LocationSuggestionSource,
): LocationSuggestion | null {
  const latitude = Number(result.lat);
  const longitude = Number(result.lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  const parts = uniqueParts([
    result.name,
    result.address?.city ?? result.address?.town ?? result.address?.village,
    result.address?.state ?? result.address?.county,
    result.address?.country,
  ]);

  return {
    id: String(result.place_id),
    name: parts.length > 0 ? parts.join(", ") : result.display_name,
    latitude,
    longitude,
    source,
  };
}

export async function searchLocationsWithNominatim(
  query: string,
  options?: {
    signal?: AbortSignal;
    limit?: number;
    countryCodes?: string;
  },
): Promise<LocationSuggestion[]> {
  const normalizedQuery = query.trim();
  if (normalizedQuery.length < 2) {
    return [];
  }

  const params = new URLSearchParams({
    q: normalizedQuery,
    format: "jsonv2",
    addressdetails: "1",
    limit: String(options?.limit ?? 5),
    "accept-language": "en",
    countrycodes: options?.countryCodes ?? DEFAULT_COUNTRY_CODES,
  });

  const response = await fetch(
    `${NOMINATIM_BASE_URL}/search?${params.toString()}`,
    {
      method: "GET",
      signal: options?.signal,
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Location search failed. Please try again.");
  }

  const data = (await response.json()) as NominatimResult[];
  return data
    .map((result) => toSuggestion(result, "nominatim"))
    .filter((result): result is LocationSuggestion => result !== null);
}

export async function reverseGeocodeWithNominatim(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<LocationSuggestion | null> {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(latitude),
    lon: String(longitude),
    addressdetails: "1",
    "accept-language": "en",
  });

  const response = await fetch(
    `${NOMINATIM_BASE_URL}/reverse?${params.toString()}`,
    {
      method: "GET",
      signal,
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Unable to determine your current location.");
  }

  const data = (await response.json()) as NominatimResult;
  return toSuggestion(data, "browser");
}

export function getBrowserCoordinates(
  options?: PositionOptions,
): Promise<GeolocationPosition> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.reject(
      new Error("Geolocation is not supported in this browser."),
    );
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      ...options,
    });
  });
}
