// CurrentWeather, ForecastDay, HourlyForecast, Alert

export interface WeatherCondition {
    text: string;
    icon: string;
    code: number;
}

export interface CurrentWeather {
    lastUpdatedEpoch: number;
    tempC: number;
    tempF: number;
    isDay: boolean;
    condition: WeatherCondition;
    windKph: number;
    windMph: number;
    windDir: string;
    pressureMb: number;
    precipMm: number;
    humidity: number;
    cloud: number;
    feelsLikeC: number;
    feelsLikeF: number;
    uv: number;
    gustKph: number;
}

export interface HourlyForecast {
    id: string;
    timeEpoch: number;
    time: string;
    tempC: number;
    tempF: number;
    isDay: boolean;
    condition: WeatherCondition;
    chanceOfRain: number;
    chanceOfSnow: number;
    willItRain: boolean;
    willItSnow: boolean;
    windKph: number;
    humidity: number;
}

export interface ForecastDay {
    id: string;
    date: string;
    dateEpoch: number;
    maxTempC: number;
    minTempC: number;
    maxTempF: number;
    minTempF: number;
    avgHumidity: number;
    maxWindKph: number;
    totalPrecipMm: number;
    condition: WeatherCondition;
    uv: number;
    sunrise: string;
    sunset: string;
    hours: HourlyForecast[];
}

export type AlertSeverity = "minor" | "moderate" | "severe" | "extreme";

export interface WeatherAlert {
    id: string;
    headline: string;
    severity: AlertSeverity;
    event: string;
    effective: string;
    expires: string;
    description: string;
}

export interface WeatherLocationInfo {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tzId: string;
    localtime: string;
}

export interface WeatherSnapshot {
    location: WeatherLocationInfo;
    current: CurrentWeather;
    forecastDays: ForecastDay[];
    alerts: WeatherAlert[];
    fetchedAtEpoch: number;
}



