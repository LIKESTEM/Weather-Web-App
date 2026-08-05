// Thin, typed fetch wrapper around the WeatherAPI.com REST API.
// Docs: https://www.weatherapi.com/docs/

import type {
    WeatherSnapshot,
    ForecastDay,
    HourlyForecast,
    WeatherAlert,
    CurrentWeather,
    WeatherLocationInfo,
    AlertSeverity,
} from "../types/weather";

import type { SearchResult } from "../types/location";

const BASE_URL = import.meta.env.BASE_URL_FROM_WEATHERAPI || "https://api.weatherapi.com/v1" as string | undefined;
const API_KEY = import.meta.env.VITE_WEATHERAPI_KEY as string | undefined;

export class WeatherApiError extends Error {
    status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = "WeatherApiError";
        this.status = status;
    }
}

// Reads the API key from the environment and throws a clear, actionable
// error immediately if it's missing, instead of later fetch
// fail with a vague 401.
function assertApiKey(): string {
    if (!API_KEY) {
        throw new WeatherApiError(
            'Missing VITE_WEATHERAPI_KEY. Add it to your .env file before calling the weather API.'
        );
    }

    return API_KEY;
}

// Builds the full request URL (base + path + key + query params), performs
// the fetch, and normalizes both network failures and non-OK HTTP responses
// into a single WeatherApiError so callers only need one catch path.
async function requestJson<T>(path: string, params: Record<string, string>): Promise<T> {
    const key = assertApiKey();
    const url = new URL(`${BASE_URL}${path}`);
    url.searchParams.set("key", key);
    Object.entries(params).forEach(([name, value]) => url.searchParams.set(name, value));

    let response: Response;

    try {
        response = await fetch(url.toString());
    } catch {
        throw new WeatherApiError("Network request failed. Check your connection and try again.");
    }

    if (!response.ok) {
        // WeatherAPI.com returns { error: { code, message } } on failure
        let message = `Weather API request failed with status ${response.status}.`;

        try {
            const body = await response.json();
            if (body?.error?.message) message = body.error.message;
        } catch {
            // response body wasn't JSON, keep the generic message
        }

        throw new WeatherApiError(message, response.status);
    }

    return (await response.json()) as T;
}


// response shape (subset of the fields WeatherAPI.com actually returns)

interface RawCondition {
    text: string;
    icon: string;
    code: number;
}

interface RawLocation {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime: string;
}

interface RawCurrent {
    last_updated_epoch: number;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: RawCondition;
    wind_kph: number;
    wind_mph: number;
    wind_dir: string;
    pressure_mb: number;
    precip_mm: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    uv: number;
    gust_kph: number;
}

interface RawHour {
    time_epoch: number;
    time: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: RawCondition;
    chance_of_rain: number;
    chance_of_snow: number;
    will_it_rain: number;
    will_it_snow: number;
    wind_kph: number;
    humidity: number;
}

interface RawForecastDay {
    date: string;
    date_epoch: number;
    day: {
        maxtemp_c: number;
        mintemp_c: number;
        maxtemp_f: number;
        mintemp_f: number;
        avghumidity: number;
        maxwind_kph: number;
        totalprecip_mm: number;
        condition: RawCondition;
        uv: number;
    };
    astro: { sunrise: string; sunset: string };
    hour: RawHour[];
}

interface RawAlert {
    headline: string;
    severity: string;
    event: string;
    effective: string;
    expires: string;
    desc: string;
}

interface RawForecastResponse {
    location: RawLocation;
    current: RawCurrent;
    forecast: { forecastday: RawForecastDay[] };
    alerts?: { alert: RawAlert[] };
}

interface RawSearchResult {
    id: number;
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
}

// Mapping: raw API JSON -> app-facing types (src/types/weather.ts)

// WeatherAPI.com's alert severity strings aren't a fixed enum, so this
// downgrades whatever text it sends into our four-value AlertSeverity type,
// defaulting to "minor" for anything unrecognized.
function normalizeSeverity(raw: string): AlertSeverity {
    const value = raw.toLowerCase();
    if (value.includes("extreme")) return "extreme";
    if (value.includes("severe")) return "severe";
    if (value.includes("moderate")) return "moderate";
    return "minor";
}

// Converts one raw hourly entry (snake_case, WeatherAPI's shape) into our
// camelCase HourlyForecast, including deriving a stable id from the epoch.
function mapHour(hour: RawHour): HourlyForecast {
    return {
        id: `${hour.time_epoch}`,
        timeEpoch: hour.time_epoch,
        time: hour.time,
        tempC: hour.temp_c,
        tempF: hour.temp_f,
        isDay: hour.is_day === 1,
        condition: hour.condition,
        chanceOfRain: hour.chance_of_rain,
        chanceOfSnow: hour.chance_of_snow,
        willItRain: hour.will_it_rain === 1,
        willItSnow: hour.will_it_snow === 1,
        windKph: hour.wind_kph,
        humidity: hour.humidity,
    };
}

// Converts one raw forecast day into our ForecastDay shape, flattening the
// nested day/astro objects and mapping all of its hourly entries via mapHour.
function mapForecastDay(day: RawForecastDay): ForecastDay {
    return {
        id: day.date,
        date: day.date,
        dateEpoch: day.date_epoch,
        maxTempC: day.day.maxtemp_c,
        minTempC: day.day.mintemp_c,
        maxTempF: day.day.maxtemp_f,
        minTempF: day.day.mintemp_f,
        avgHumidity: day.day.avghumidity,
        maxWindKph: day.day.maxwind_kph,
        totalPrecipMm: day.day.totalprecip_mm,
        condition: day.day.condition,
        uv: day.day.uv,
        sunrise: day.astro.sunrise,
        sunset: day.astro.sunset,
        hours: day.hour.map(mapHour),
    };
}

// Converts the raw "current conditions" object into our camelCase
// CurrentWeather type.
function mapCurrent(current: RawCurrent): CurrentWeather {
    return {
        lastUpdatedEpoch: current.last_updated_epoch,
        tempC: current.temp_c,
        tempF: current.temp_f,
        isDay: current.is_day === 1,
        condition: current.condition,
        windKph: current.wind_kph,
        windMph: current.wind_mph,
        windDir: current.wind_dir,
        pressureMb: current.pressure_mb,
        precipMm: current.precip_mm,
        humidity: current.humidity,
        cloud: current.cloud,
        feelsLikeC: current.feelslike_c,
        feelsLikeF: current.feelslike_f,
        uv: current.uv,
        gustKph: current.gust_kph,
    };
}

// Converts the raw location block into our WeatherLocationInfo type
// (mainly renaming tz_id to tzId for naming-convention consistency).
function mapLocation(location: RawLocation): WeatherLocationInfo {
    return {
        name: location.name,
        region: location.region,
        country: location.country,
        lat: location.lat,
        lon: location.lon,
        tzId: location.tz_id,
        localtime: location.localtime,
    };
}

// Converts one raw alert into our WeatherAlert type. WeatherAPI.com doesn't
// give alerts a stable id, so one is synthesized from the event name + its
// index in the list.
function mapAlert(alert: RawAlert, index: number): WeatherAlert {
    return {
        id: `${alert.event}-${index}`,
        headline: alert.headline,
        severity: normalizeSeverity(alert.severity),
        event: alert.event,
        effective: alert.effective,
        expires: alert.expires,
        description: alert.desc,
    };
}

// Assembles the full WeatherSnapshot from a raw /forecast.json response by
// combining all the individual mappers above, and stamps it with the time
// it was fetched (used later for cache-freshness checks).
function mapSnapshot(raw: RawForecastResponse): WeatherSnapshot {
    return {
        location: mapLocation(raw.location),
        current: mapCurrent(raw.current),
        forecastDays: raw.forecast.forecastday.map(mapForecastDay),
        alerts: (raw.alerts?.alert ?? []).map(mapAlert),
        fetchedAtEpoch: Math.floor(Date.now() / 1000),
    };
}

// Public API 

/** 
 * Fetches current conditions + forecast + alerts for a location in one call.
 * 
 * @param locationQuery - City name ("London"), "lat.lon" pair, US zip, or UK postcode.
 * See https://www.weatherapi.com/docs/#intro-request for all accepted formats.
 * @param days - Number of forecast days to request (1-14, plan-dependent). 
 * Defaults to 7
 * 
*/

export async function fetchCurrentAndForecast(
    locationQuery: string,
    days = 7
): Promise<WeatherSnapshot> {
    const raw = await requestJson<RawForecastResponse>("/forecast.json", {
        q: locationQuery,
        days: days.toString(),
        alerts: "yes",
    });
    return mapSnapshot(raw);
}

/**
 * Autocomplete/search for locations matching a partial query string.
 * Used by the SearchBar component to populate SearchResultsList.
 * 
 */
export async function searchLocations(partialQuery: string): Promise<SearchResult[]> {
    if (!partialQuery.trim()) return [];

    const raw = await requestJson<RawSearchResult[]>("/search.json", {
        q: partialQuery
    });

    return raw.map((result) => ({
        id: result.id,
        name: result.name,
        region: result.region,
        country: result.country,
        lat: result.lat,
        lon: result.lon,
        queryValue: `${result.lat},${result.lon}`,
    }));
}


/**
 * Convenience helper for resolving a browser Geolocation position
 * into a query string the API accepts directly.
 * 
 */
export function coordsToQueryValue(latitude: number, longitude: number): string {
    return `${latitude},${longitude}`;
}















