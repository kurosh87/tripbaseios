const admin = require('firebase-admin');
const serviceAccount = require('../firebase-func/functions/tripbase-7f203-firebase-adminsdk-fbsvc-fe9727f3b7.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkUserPreferences() {
  try {
    const snapshot = await db.collection('userPreferences').get();
    
    console.log('\n=== Current User Preferences ===\n');
    
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`User ID: ${doc.id}`);
      console.log('Wake Up Time:', data.wakeUpTime);
      console.log('Bed Time:', data.bedTime);
      console.log('Sleep Type:', data.chronotype);
      console.log('Uses Melatonin:', data.useMelatonin);
      console.log('Max Daily Caffeine:', data.maxDailyCaffeine, 'mg');
      console.log('Last Updated:', data.lastUpdated);
      console.log('-------------------\n');
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
  }
}

checkUserPreferences(); 