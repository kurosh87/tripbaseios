import * as admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';

// Initialize Firebase Admin
initializeApp();

const db = admin.firestore();
const COLLECTION = 'userPreferences';

// Function to get current user's preferences
async function getCurrentUserPreferences(userId: string) {
    try {
        const prefsDoc = await db.collection(COLLECTION).doc(userId).get();
        if (!prefsDoc.exists) {
            console.log('No preferences found for user:', userId);
            return null;
        }
        console.log('Current preferences:', prefsDoc.data());
        return prefsDoc.data();
    } catch (error) {
        console.error('Error getting preferences:', error);
        return null;
    }
}

// Function to update wake-up time
async function updateWakeUpTime(userId: string, newTime: string) {
    try {
        await db.collection(COLLECTION).doc(userId).update({
            wakeUpTime: newTime,
            lastUpdated: new Date().toISOString()
        });
        console.log('Successfully updated wake-up time to:', newTime);
        
        // Get and show the updated preferences
        const updatedPrefs = await getCurrentUserPreferences(userId);
        console.log('Updated preferences:', updatedPrefs);
    } catch (error) {
        console.error('Error updating wake-up time:', error);
    }
}

// Replace with your user ID
const userId = 'YOUR_USER_ID';

// First get current preferences
getCurrentUserPreferences(userId).then(() => {
    // Then update wake-up time to 6:00 AM
    updateWakeUpTime(userId, '06:00');
}); 