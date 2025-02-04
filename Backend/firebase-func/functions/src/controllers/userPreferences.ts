import * as functions from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { UserPreferences, DEFAULT_USER_PREFERENCES } from '../types/userPreferences';
import { CallableRequest } from 'firebase-functions/v2/https';

const db = admin.firestore();
const COLLECTION = 'userPreferences';

// Get user preferences
export const getUserPreferences = functions.onCall(async (request: CallableRequest) => {
    // Ensure user is authenticated
    if (!request.auth) {
        throw new functions.HttpsError('unauthenticated', 'User must be authenticated');
    }

    try {
        const userId = request.auth.uid;
        const prefsDoc = await db.collection(COLLECTION).doc(userId).get();

        if (!prefsDoc.exists) {
            // Create default preferences for new users
            const defaultPrefs: UserPreferences = {
                ...DEFAULT_USER_PREFERENCES,
                userId,
            };
            await db.collection(COLLECTION).doc(userId).set(defaultPrefs);
            return defaultPrefs;
        }

        return prefsDoc.data() as UserPreferences;
    } catch (error) {
        console.error('Error getting user preferences:', error);
        throw new functions.HttpsError('internal', 'Error retrieving preferences');
    }
});

// Update user preferences
export const updateUserPreferences = functions.onCall(async (request: CallableRequest) => {
    // Ensure user is authenticated
    if (!request.auth) {
        throw new functions.HttpsError('unauthenticated', 'User must be authenticated');
    }

    try {
        const userId = request.auth.uid;
        const data = request.data as Partial<UserPreferences>;
        
        // Validate time formats
        if (data.wakeUpTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.wakeUpTime)) {
            throw new functions.HttpsError('invalid-argument', 'Invalid wake-up time format');
        }
        if (data.bedTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.bedTime)) {
            throw new functions.HttpsError('invalid-argument', 'Invalid bedtime format');
        }

        // Validate chronotype
        if (data.chronotype && !['EARLY_BIRD', 'NIGHT_OWL', 'INTERMEDIATE'].includes(data.chronotype)) {
            throw new functions.HttpsError('invalid-argument', 'Invalid chronotype');
        }

        // Validate caffeine sensitivity
        if (data.caffeineSensitivity && !['LOW', 'MEDIUM', 'HIGH'].includes(data.caffeineSensitivity)) {
            throw new functions.HttpsError('invalid-argument', 'Invalid caffeine sensitivity');
        }

        // Update lastUpdated timestamp
        const updateData = {
            ...data,
            lastUpdated: new Date().toISOString(),
            userId
        };

        await db.collection(COLLECTION).doc(userId).set(updateData, { merge: true });
        
        // Get and return the updated preferences
        const updatedDoc = await db.collection(COLLECTION).doc(userId).get();
        return updatedDoc.data() as UserPreferences;
    } catch (error) {
        console.error('Error updating user preferences:', error);
        throw new functions.HttpsError('internal', 'Error updating preferences');
    }
});

// Delete user preferences
export const deleteUserPreferences = functions.onCall(async (request: CallableRequest) => {
    // Ensure user is authenticated
    if (!request.auth) {
        throw new functions.HttpsError('unauthenticated', 'User must be authenticated');
    }

    try {
        const userId = request.auth.uid;
        await db.collection(COLLECTION).doc(userId).delete();
        return { success: true };
    } catch (error) {
        console.error('Error deleting user preferences:', error);
        throw new functions.HttpsError('internal', 'Error deleting preferences');
    }
});

// Cleanup preferences when user account is deleted
export const cleanupUserPreferences = functions.onCall(async (request: CallableRequest) => {
    if (!request.auth) {
        throw new functions.HttpsError('unauthenticated', 'User must be authenticated');
    }

    try {
        const userId = request.auth.uid;
        await db.collection(COLLECTION).doc(userId).delete();
        console.log(`Cleaned up preferences for user ${userId}`);
        return { success: true };
    } catch (error) {
        console.error('Error cleaning up user preferences:', error);
        throw new functions.HttpsError('internal', 'Error cleaning up preferences');
    }
}); 