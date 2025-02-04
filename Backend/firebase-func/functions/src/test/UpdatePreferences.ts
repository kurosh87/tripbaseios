import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as serviceAccount from '../../tripbase-7f203-firebase-adminsdk-fbsvc-fe9727f3b7.json';

// Initialize Firebase Admin with service account
initializeApp({
    credential: cert(serviceAccount as any)
});

const db = getFirestore();
const COLLECTION = 'userPreferences';

async function updateUserPreferences(userId: string, updates: any) {
    try {
        console.log('Updating preferences:', updates);
        await db.collection(COLLECTION).doc(userId).update({
            ...updates,
            lastUpdated: new Date().toISOString()
        });
        console.log('Successfully updated preferences');
    } catch (error) {
        console.error('Error updating preferences:', error);
    }
}

// Update preferences for our test user
const userId = 'olV0qmNq2Sdo4lCvKn8HalP9BlR2';
updateUserPreferences(userId, {
    wakeUpTime: '06:00',  // Changing to 6:00 AM
    bedTime: '11:00',     // Keeping bedtime the same
    maxDailyCaffeine: 400 // Setting to 400mg as shown in your screenshot
}); 