const admin = require('firebase-admin');
const serviceAccount = require('../firebase-func/functions/tripbase-7f203-firebase-adminsdk-fbsvc-fe9727f3b7.json');

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Test data
const sampleFlight = {
    segments: [{
        flightNumber: "UA123",
        airline: {
            code: "UA",
            name: "United Airlines"
        },
        departure: {
            airport: {
                code: "SFO",
                name: "San Francisco International",
                city: "San Francisco",
                country: "USA",
                location: {
                    latitude: 37.7749,
                    longitude: -122.4194
                }
            },
            scheduledTime: "2024-03-15T10:00:00Z"
        },
        arrival: {
            airport: {
                code: "JFK",
                name: "John F. Kennedy International",
                city: "New York",
                country: "USA",
                location: {
                    latitude: 40.7128,
                    longitude: -74.0060
                }
            },
            scheduledTime: "2024-03-15T18:00:00Z"
        },
        status: "SCHEDULED"
    }],
    tripName: "Test Flight to NYC"
};

async function runTests() {
    try {
        console.log('🚀 Starting flight itinerary tests...\n');

        // Get the test user's UID (you can replace this with any valid user UID from your Firebase Auth)
        const testUser = await admin.auth().getUserByEmail('test@example.com').catch(() => {
            // Create a test user if doesn't exist
            return admin.auth().createUser({
                email: 'test@example.com',
                password: 'testpassword123'
            });
        });
        
        console.log('👤 Test user:', testUser.uid);

        // 1. Create a flight itinerary
        console.log('\n1️⃣ Testing flight itinerary creation...');
        const db = admin.firestore();
        const docRef = db.collection('flightItineraries').doc();
        const now = admin.firestore.Timestamp.now();
        
        const itinerary = {
            ...sampleFlight,
            userId: testUser.uid,
            createdAt: now.toDate().toISOString(),
            updatedAt: now.toDate().toISOString(),
            id: docRef.id
        };
        
        await docRef.set(itinerary);
        console.log('✅ Flight itinerary created successfully');
        console.log('📝 Itinerary ID:', docRef.id);

        // 2. Retrieve the created itinerary
        console.log('\n2️⃣ Testing flight itinerary retrieval...');
        const retrievedDoc = await docRef.get();
        const retrievedData = retrievedDoc.data();
        console.log('✅ Retrieved flight itinerary:');
        console.log(JSON.stringify(retrievedData, null, 2));

        // 3. Update the itinerary
        console.log('\n3️⃣ Testing flight itinerary update...');
        const updateData = {
            tripName: "Updated Test Flight to NYC",
            updatedAt: admin.firestore.Timestamp.now().toDate().toISOString()
        };
        
        await docRef.update(updateData);
        console.log('✅ Flight itinerary updated successfully');

        // 4. Verify update
        console.log('\n4️⃣ Verifying update...');
        const updatedDoc = await docRef.get();
        const updatedData = updatedDoc.data();
        console.log('✅ Updated trip name:', updatedData.tripName);

        // 5. List all user's itineraries
        console.log('\n5️⃣ Testing user itineraries listing...');
        const userItineraries = await db.collection('flightItineraries')
            .where('userId', '==', testUser.uid)
            .get();
        
        console.log(`✅ Found ${userItineraries.docs.length} itineraries for user`);

        // 6. Clean up (optional - comment out if you want to keep the test data)
        console.log('\n6️⃣ Cleaning up test data...');
        await docRef.delete();
        console.log('✅ Test flight itinerary deleted');

        console.log('\n✨ All tests completed successfully!');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
    }
}

// Run the tests
runTests().then(() => {
    console.log('\n👋 Test script completed');
    process.exit(0);
}); 