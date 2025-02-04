# Firebase Functions Documentation

## Overview
This documentation covers our Firebase Functions setup, including user preferences management, testing tools, and best practices.

## Table of Contents
1. [Setup](#setup)
2. [API Security](#api-security)
3. [User Preferences](#user-preferences)
4. [Testing Tools](#testing-tools)
5. [Best Practices](#best-practices)

## Setup

### Prerequisites
- Node.js (v18 recommended)
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase Admin SDK
- Firebase service account credentials

### Initial Setup
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firestore
firebase init firestore
```

## API Security

### Credential Management
We use a template-based approach to secure API credentials. There are two main types of sensitive files:

1. **Firebase Service Account**
   - Template: `tripbase-7f203-firebase-adminsdk-fbsvc-fe9727f3b7.template.json`
   - Actual: `tripbase-7f203-firebase-adminsdk-fbsvc-fe9727f3b7.json` (not in repo)

2. **API Keys Configuration**
   - Template: `src/config.template.ts`
   - Actual: `src/config.ts` (not in repo)

### Setup Instructions for New Developers

1. **Firebase Service Account**
   ```bash
   # Navigate to Backend/tools
   cd Backend/tools
   
   # Run the setup script
   node setup-credentials.js
   ```

2. **API Keys Configuration**
   ```bash
   # Navigate to functions directory
   cd Backend/firebase-func/functions/src
   
   # Copy template
   cp config.template.ts config.ts
   
   # Edit config.ts with your actual keys
   ```

### Security Measures in Place

1. **Git Protection**
   - Both actual credential files are listed in `.gitignore`
   - Template files show the required structure
   - GitHub secret scanning enabled to catch accidental commits

2. **File Structure**
   ```
   Backend/
   ├── firebase-func/
   │   └── functions/
   │       ├── src/
   │       │   ├── config.template.ts  (in repo)
   │       │   └── config.ts           (local only)
   │       ├── tripbase-*-template.json (in repo)
   │       └── tripbase-*.json         (local only)
   ```

3. **Validation**
   - GitHub push protection enabled
   - Secret scanning for accidental API key commits
   - Local git hooks (recommended)

### Best Practices for Credentials

1. **Never commit actual credentials**
   - Always use template files
   - Keep sensitive files in `.gitignore`
   - Use environment variables when possible

2. **Credential Rotation**
   - Regularly rotate API keys
   - Update team members securely
   - Document rotation procedures

3. **Access Control**
   - Limit access to production credentials
   - Use different keys for development
   - Implement proper role-based access

## User Preferences

### Data Structure
User preferences are stored in the `userPreferences` collection with the following schema:
```typescript
interface UserPreferences {
    wakeUpTime: string;        // Format: "HH:mm"
    bedTime: string;           // Format: "HH:mm"
    useMelatonin: boolean;
    melatoninDosage?: number;  // in mg, optional
    chronotype: 'EARLY_BIRD' | 'NIGHT_OWL' | 'INTERMEDIATE';
    caffeineSensitivity: 'LOW' | 'MEDIUM' | 'HIGH';
    maxDailyCaffeine?: number; // in mg, optional
    lastUpdated: string;       // ISO timestamp
    userId: string;            // Firebase Auth UID
}
```

### Verification Tools
We've created tools to verify user preferences synchronization:

1. **Check Preferences Script** (`Backend/tools/check-preferences.js`):
```javascript
const admin = require('firebase-admin');
// ... setup code ...

async function checkUserPreferences() {
  const snapshot = await db.collection('userPreferences').get();
  // Displays all user preferences
}
```

### Real-time Updates
User preferences are synchronized in real-time between the app and Firebase:
1. Local changes in the app trigger immediate updates to Firebase
2. Changes are stored both locally (using @AppStorage) and in Firebase
3. Updates include timestamps for tracking changes

## Testing Tools

### Local Testing
1. **Firebase Emulator**:
```bash
firebase emulators:start
```

2. **Check Current Data**:
```bash
cd Backend/tools
node check-preferences.js
```

### Debugging Tips
1. Check Firebase Console for real-time updates
2. Use the Firebase Emulator UI for local testing
3. Monitor Analytics events for tracking updates

## Best Practices

### Security
1. Always use Firebase Security Rules to protect data
2. Validate data on both client and server side
3. Keep service account credentials secure

### Performance
1. Use batch updates when modifying multiple fields
2. Implement proper error handling
3. Use appropriate data types and formats

### Code Organization
1. Keep Firebase function logic separate
2. Use TypeScript for better type safety
3. Implement proper logging and monitoring

## Next Steps

### Planned Improvements
1. Implement batch updates for multiple preference changes
2. Add data validation middleware
3. Enhance error handling and recovery
4. Add comprehensive testing suite

### Additional Features
1. User preference history tracking
2. Backup and restore functionality
3. Analytics dashboard for preference trends
4. Multi-device sync improvements

## Troubleshooting

### Common Issues
1. Network connectivity problems
2. Authentication errors
3. Data validation failures

### Solutions
1. Check network connection and Firebase status
2. Verify authentication state
3. Validate data format before updates

## Resources
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Functions](https://firebase.google.com/docs/functions)
- [Firestore](https://firebase.google.com/docs/firestore) 