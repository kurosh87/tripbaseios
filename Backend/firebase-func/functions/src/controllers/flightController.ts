import * as admin from 'firebase-admin';
import { FlightItinerary, FlightOperationResponse } from '../models/flight';

const db = admin.firestore();
const COLLECTION_NAME = 'flightItineraries';

// Helper function to convert Firestore timestamp to ISO string
const convertTimestampToISO = (timestamp: admin.firestore.Timestamp): string => {
    return timestamp.toDate().toISOString();
};

// Helper function to convert Firestore document to FlightItinerary
const convertDocToFlightItinerary = (doc: admin.firestore.DocumentSnapshot): FlightItinerary => {
    const data = doc.data();
    if (!data) throw new Error('Document data is undefined');
    
    return {
        ...data,
        id: doc.id,
        createdAt: convertTimestampToISO(data.createdAt),
        updatedAt: convertTimestampToISO(data.updatedAt)
    } as FlightItinerary;
};

// Save a new flight itinerary
export async function saveFlightItinerary(
    userId: string,
    itineraryData: Omit<FlightItinerary, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<FlightOperationResponse> {
    try {
        // Create a new document reference
        const docRef = db.collection(COLLECTION_NAME).doc();
        
        // Prepare the data with timestamps
        const now = admin.firestore.Timestamp.now();
        const itinerary: Omit<FlightItinerary, 'id'> = {
            ...itineraryData,
            userId,
            createdAt: now.toDate().toISOString(),
            updatedAt: now.toDate().toISOString()
        };
        
        // Save to Firestore
        await docRef.set(itinerary);
        
        // Return the saved itinerary with its ID
        return {
            success: true,
            message: 'Flight itinerary saved successfully',
            data: {
                ...itinerary,
                id: docRef.id
            }
        };
    } catch (error) {
        console.error('Error saving flight itinerary:', error);
        return {
            success: false,
            message: 'Failed to save flight itinerary',
            error
        };
    }
}

// Get all flight itineraries for a user
export async function getUserFlightItineraries(userId: string): Promise<FlightOperationResponse> {
    try {
        const snapshot = await db.collection(COLLECTION_NAME)
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();
        
        const itineraries = snapshot.docs.map(convertDocToFlightItinerary);
        
        return {
            success: true,
            message: 'Flight itineraries retrieved successfully',
            data: itineraries
        };
    } catch (error) {
        console.error('Error getting flight itineraries:', error);
        return {
            success: false,
            message: 'Failed to retrieve flight itineraries',
            error
        };
    }
}

// Get a specific flight itinerary
export async function getFlightItinerary(userId: string, itineraryId: string): Promise<FlightOperationResponse> {
    try {
        const doc = await db.collection(COLLECTION_NAME).doc(itineraryId).get();
        
        if (!doc.exists) {
            return {
                success: false,
                message: 'Flight itinerary not found'
            };
        }
        
        const itinerary = convertDocToFlightItinerary(doc);
        
        // Check if the itinerary belongs to the user
        if (itinerary.userId !== userId) {
            return {
                success: false,
                message: 'Unauthorized access to flight itinerary'
            };
        }
        
        return {
            success: true,
            message: 'Flight itinerary retrieved successfully',
            data: itinerary
        };
    } catch (error) {
        console.error('Error getting flight itinerary:', error);
        return {
            success: false,
            message: 'Failed to retrieve flight itinerary',
            error
        };
    }
}

// Update a flight itinerary
export async function updateFlightItinerary(
    userId: string,
    itineraryId: string,
    updates: Partial<Omit<FlightItinerary, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<FlightOperationResponse> {
    try {
        const docRef = db.collection(COLLECTION_NAME).doc(itineraryId);
        const doc = await docRef.get();
        
        if (!doc.exists) {
            return {
                success: false,
                message: 'Flight itinerary not found'
            };
        }
        
        const itinerary = convertDocToFlightItinerary(doc);
        
        // Check if the itinerary belongs to the user
        if (itinerary.userId !== userId) {
            return {
                success: false,
                message: 'Unauthorized access to flight itinerary'
            };
        }
        
        // Update the document
        const updateData = {
            ...updates,
            updatedAt: admin.firestore.Timestamp.now().toDate().toISOString()
        };
        
        await docRef.update(updateData);
        
        // Get the updated document
        const updatedDoc = await docRef.get();
        const updatedItinerary = convertDocToFlightItinerary(updatedDoc);
        
        return {
            success: true,
            message: 'Flight itinerary updated successfully',
            data: updatedItinerary
        };
    } catch (error) {
        console.error('Error updating flight itinerary:', error);
        return {
            success: false,
            message: 'Failed to update flight itinerary',
            error
        };
    }
}

// Delete a flight itinerary
export async function deleteFlightItinerary(userId: string, itineraryId: string): Promise<FlightOperationResponse> {
    try {
        const docRef = db.collection(COLLECTION_NAME).doc(itineraryId);
        const doc = await docRef.get();
        
        if (!doc.exists) {
            return {
                success: false,
                message: 'Flight itinerary not found'
            };
        }
        
        const itinerary = convertDocToFlightItinerary(doc);
        
        // Check if the itinerary belongs to the user
        if (itinerary.userId !== userId) {
            return {
                success: false,
                message: 'Unauthorized access to flight itinerary'
            };
        }
        
        // Delete the document
        await docRef.delete();
        
        return {
            success: true,
            message: 'Flight itinerary deleted successfully'
        };
    } catch (error) {
        console.error('Error deleting flight itinerary:', error);
        return {
            success: false,
            message: 'Failed to delete flight itinerary',
            error
        };
    }
} 