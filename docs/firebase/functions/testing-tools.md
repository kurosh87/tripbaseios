# Firebase Testing Tools

## Check Preferences Tool

### Overview
The Check Preferences tool (`check-preferences.js`) is a Node.js script that allows us to verify user preferences stored in Firebase Firestore. It's particularly useful for debugging and verifying that user preference updates are being properly synchronized.

### Setup
1. Navigate to the tools directory:
```bash
cd Backend/tools
```

2. Install dependencies:
```bash
npm install firebase-admin
```

3. Ensure you have the service account credentials file in place:
```bash
Backend/firebase-func/functions/tripbase-7f203-firebase-adminsdk-fbsvc-fe9727f3b7.json
```

### Usage
Run the script:
```bash
node check-preferences.js
```

### Output Example
```
=== Current User Preferences ===

User ID: olV0qmNq2Sdo4lCvKn8HalP9BlR2
Wake Up Time: 07:00
Bed Time: 23:00
Sleep Type: INTERMEDIATE
Uses Melatonin: false
Max Daily Caffeine: 400 mg
Last Updated: 2025-02-04T20:19:42Z
-------------------
```

### Code Explanation
```javascript
const admin = require('firebase-admin');
const serviceAccount = require('../firebase-func/functions/tripbase-7f203-firebase-adminsdk-fbsvc-fe9727f3b7.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Main function to check preferences
async function checkUserPreferences() {
  try {
    const snapshot = await db.collection('userPreferences').get();
    console.log('\n=== Current User Preferences ===\n');
    
    snapshot.forEach(doc => {
      const data = doc.data();
      // Display each field in a readable format
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
```

## Future Improvements

### Planned Enhancements
1. Add filtering capabilities to check specific users
2. Add ability to watch for real-time updates
3. Add data validation checks
4. Add historical data viewing

### Example: Adding User Filtering
```javascript
async function checkUserPreferences(userId = null) {
  try {
    let query = db.collection('userPreferences');
    if (userId) {
      query = query.where('userId', '==', userId);
    }
    const snapshot = await query.get();
    // ... rest of the code
  } catch (error) {
    console.error('Error fetching preferences:', error);
  }
}
```

### Example: Adding Real-time Updates
```javascript
function watchUserPreferences(userId = null) {
  let query = db.collection('userPreferences');
  if (userId) {
    query = query.where('userId', '==', userId);
  }
  
  return query.onSnapshot(snapshot => {
    console.log('\n=== User Preferences Update ===\n');
    snapshot.docChanges().forEach(change => {
      if (change.type === 'modified') {
        const data = change.doc.data();
        console.log(`User ${change.doc.id} preferences updated:`);
        console.log(data);
      }
    });
  });
}
```

## Troubleshooting

### Common Issues
1. **Authentication Errors**
   - Verify service account credentials
   - Check file paths
   - Ensure proper permissions

2. **Network Issues**
   - Check Firebase console status
   - Verify network connectivity
   - Check firewall settings

3. **Data Format Issues**
   - Verify data types match schema
   - Check for missing required fields
   - Validate timestamp formats

### Best Practices
1. Always handle errors appropriately
2. Use type checking for data validation
3. Keep service account credentials secure
4. Regular testing and validation
5. Monitor Firebase quotas and usage 