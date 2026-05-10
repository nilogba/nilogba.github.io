export interface TravelPlace {
    id: string
    name: string
    country: string
    lat: number
    lng: number
    year: string
    folder: string
}

export const TRAVEL_PLACES: TravelPlace[] = [
    { id: "kashmir", name: "Kashmir", country: "India", lat: 34.08, lng: 74.80, year: "2023", folder: "travel/kashmir" },
    { id: "bali", name: "Bali", country: "Indonesia", lat: -8.34, lng: 115.09, year: "2025", folder: "travel/bali" },
    { id: "singapore", name: "Singapore", country: "Singapore", lat: 1.35, lng: 103.82, year: "2025", folder: "travel/singapore" },
    { id: "vietnam", name: "Vietnam", country: "Vietnam", lat: 14.06, lng: 108.27, year: "2025", folder: "travel/vietnam" },
]
