import { StringLiteral } from "typescript";

export interface ForecastImages {
    'Thunderstorm': string;
    'Drizzle': string;
    'Mist': string;
    'Smoke': string;
    'Haze': string;
    'Dust': string;
    'Fog': string;
    'Sand': string;
    'Ash': string;
    'Squall': string;
    'Tornado': string;
    'Clear': string;
    'Clouds': string;
    'Rain': string;
    'Snow': string;
}

export interface LocationData {
    location: string;
    lattitude: number;
    longitude: number;
}

export interface WeatherData {
    high: number;
    low: number;
    humidity: string;
    forecast: keyof ForecastImages;
    description: string;
}

export interface AllWeatherData extends LocationData, WeatherData {}