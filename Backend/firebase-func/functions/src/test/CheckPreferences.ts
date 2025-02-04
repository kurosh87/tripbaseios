import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as serviceAccount from '../../tripbase-7f203-firebase-adminsdk-fbsvc-fe9727f3b7.json';

// Initialize Firebase Admin with service account
initializeApp({
    credential: cert(serviceAccount as any)
});

const db = getFirestore();
const COLLECTION = 'userPreferences';

async function checkPreferences() {
    const userId = 'olV0qmNq2Sdo4lCvKn8HalP9BlR2';
    try {
        const doc = await db.collection(COLLECTION).doc(userId).get();
        if (doc.exists) {
            console.log('Current preferences:', JSON.stringify(doc.data(), null, 2));
        } else {
            console.log('No preferences found');
        }
    } catch (error) {
        console.error('Error checking preferences:', error);
    }
}

checkPreferences(); 