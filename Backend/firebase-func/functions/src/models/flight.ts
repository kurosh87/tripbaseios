// Flight data models for TripBase

// Basic airport information
export interface Airport {
    code: string;        // Airport IATA code (e.g., "SFO")
    name: string;        // Full airport name
    city: string;        // City name
    country: string;     // Country name
    location: {
        latitude: number;
        longitude: number;
    };
}

// Single flight segment information
export interface FlightSegment {
    flightNumber: string;
    airline: {
        code: string;    // Airline IATA code
        name: string;    // Full airline name
    };
    departure: {
        airport: Airport;
        scheduledTime: string;     // ISO timestamp
        terminal?: string;         // Optional terminal information
        gate?: string;            // Optional gate information
    };
    arrival: {
        airport: Airport;
        scheduledTime: string;     // ISO timestamp
        terminal?: string;         // Optional terminal information
        gate?: string;            // Optional gate information
    };
    status?: 'SCHEDULED' | 'DELAYED' | 'BOARDING' | 'IN_AIR' | 'LANDED' | 'CANCELLED';
    aircraft?: {
        type: string;
        registration?: string;
    };
}

// Complete flight itinerary
export interface FlightItinerary {
    id: string;                   // Unique identifier for the itinerary
    userId: string;               // Firebase Auth UID of the user
    bookingReference?: string;    // Optional booking/confirmation number
    segments: FlightSegment[];    // One or more flight segments
    createdAt: string;           // ISO timestamp
    updatedAt: string;           // ISO timestamp
    tags?: string[];             // Optional tags for organization
    notes?: string;              // Optional user notes
    tripName?: string;           // Optional trip name for organization
}

// Response type for flight operations
export interface FlightOperationResponse {
    success: boolean;
    message: string;
    data?: FlightItinerary | FlightItinerary[];
    error?: any;
} 