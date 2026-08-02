// SavedLocation, SearchResult

export interface SearchResult {
    id: number;
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    /* value to pass back into the API as the 'q' param, e.g. "lat,lon" */
    queryValue: string;
}

export interface SavedLocation {
    id: string;
    label: string;
    queryValue: string;
    isCurrentLocation: boolean;
}














