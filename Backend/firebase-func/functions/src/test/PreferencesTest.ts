import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { UserPreferences } from '../types/userPreferences';
import * as serviceAccount from '../../tripbase-7f203-firebase-adminsdk-fbsvc-fe9727f3b7.json';

// Initialize Firebase Admin with service account
initializeApp({
    credential: cert(serviceAccount as any)
});

const auth = getAuth();
const db = getFirestore();
const COLLECTION = 'userPreferences';

async function watchUserPreferences(userId: string) {
    console.log(`Starting real-time watch for user ${userId}...`);
    console.log('Press Ctrl+C to stop watching\n');

    // Set up real-time listener
    const unsubscribe = db.collection(COLLECTION).doc(userId)
        .onSnapshot((snapshot) => {
            if (snapshot.exists) {
                const data = snapshot.data() as UserPreferences;
                console.log('\n=== Preference Update Detected ===');
                console.log('Timestamp:', new Date().toLocaleString());
                console.log('Current Preferences:', JSON.stringify(data, null, 2));
                console.log('===============================\n');
            } else {
                console.log('No preferences found for user');
            }
        }, (error) => {
            console.error('Error watching preferences:', error);
        });

    // Keep the script running
    return new Promise((resolve) => {
        process.on('SIGINT', () => {
            console.log('\nStopping watch...');
            unsubscribe();
            resolve(undefined);
        });
    });
}

async function testUserPreferences() {
    try {
        // First, let's get a test user
        const users = await auth.listUsers(1);
        if (users.users.length === 0) {
            console.error('No users found in the database');
            return;
        }

        const testUser = users.users[0];
        console.log('Testing with user:', testUser.uid);

        // Start watching the user's preferences
        await watchUserPreferences(testUser.uid);

    } catch (error) {
        if (error instanceof Error) {
            console.error('Test failed:', error.message);
        } else {
            console.error('Test failed with unknown error');
        }
    }
}

// Run the tests
testUserPreferences(); 