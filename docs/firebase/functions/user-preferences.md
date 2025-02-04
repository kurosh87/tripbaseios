# User Preferences System

## Overview
The user preferences system manages sleep and routine settings for users, synchronizing data between the iOS app and Firebase Firestore in real-time.

## Architecture

### Data Flow
1. User changes preferences in iOS app
2. Local storage (@AppStorage) is updated immediately
3. Firebase update is triggered
4. Changes are persisted to Firestore
5. Real-time listeners update other devices

### Data Structure

#### Firestore Schema
```typescript
interface UserPreferences {
    // Sleep Schedule
    wakeUpTime: string;        // Format: "HH:mm"
    bedTime: string;           // Format: "HH:mm"
    
    // Sleep Aid Preferences
    useMelatonin: boolean;
    melatoninDosage?: number;  // in mg, optional
    
    // Sleep Type
    chronotype: 'EARLY_BIRD' | 'NIGHT_OWL' | 'INTERMEDIATE';
    
    // Caffeine Management
    caffeineSensitivity: 'LOW' | 'MEDIUM' | 'HIGH';
    maxDailyCaffeine?: number; // in mg, optional
    
    // Metadata
    lastUpdated: string;       // ISO timestamp
    userId: string;            // Firebase Auth UID
}
```

#### Local Storage (@AppStorage)
```swift
@AppStorage("wakeUpTime") private var wakeUpTime: Date
@AppStorage("bedTime") private var bedTime: Date
@AppStorage("chronotype") private var chronotype: String
@AppStorage("usesMelatonin") private var usesMelatonin: Bool
@AppStorage("caffeineCutoffTime") private var caffeineCutoffTime: Date
@AppStorage("maxCaffeineIntake") private var maxCaffeineIntake: Int
```

## Implementation

### iOS App (Swift)

#### Update Function
```swift
private func updateFirebase() {
    let formatter = DateFormatter()
    formatter.dateFormat = "HH:mm"
    
    Task {
        let chronotypeMap = [
            "Lion (Early Bird)": "EARLY_BIRD",
            "Wolf (Night Owl)": "NIGHT_OWL",
            "Bear (Middle of the Road)": "INTERMEDIATE",
            "Dolphin (Light Sleeper)": "INTERMEDIATE"
        ]
        
        _ = await db.updateUserPreferences(
            wakeUpTime: formatter.string(from: wakeUpTime),
            bedTime: formatter.string(from: bedTime),
            useMelatonin: usesMelatonin,
            chronotype: chronotypeMap[chronotype] ?? "INTERMEDIATE",
            maxDailyCaffeine: maxCaffeineIntake
        )
    }
}
```

#### Firebase Backend Function
```swift
public func updateUserPreferences(
    wakeUpTime: String? = nil,
    bedTime: String? = nil,
    useMelatonin: Bool? = nil,
    melatoninDosage: Int? = nil,
    chronotype: String? = nil,
    caffeineSensitivity: String? = nil,
    maxDailyCaffeine: Int? = nil
) async -> Bool {
    Analytics.capture(.info, id: "update_user_preferences_called", source: .db)
    
    guard let userId = currentUser?.uid else {
        Analytics.capture(.error, id: "update_user_preferences", 
                        longDescription: "No user logged in", source: .db)
        return false
    }
    
    var updateData: [String: Any] = [:]
    
    // Add fields that need updating
    if let wakeUpTime = wakeUpTime { updateData["wakeUpTime"] = wakeUpTime }
    if let bedTime = bedTime { updateData["bedTime"] = bedTime }
    // ... other fields ...
    
    updateData["lastUpdated"] = ISO8601DateFormatter().string(from: Date())
    updateData["userId"] = userId
    
    do {
        try await _db.collection("userPreferences")
            .document(userId)
            .setData(updateData, merge: true)
        Analytics.capture(.success, id: "update_user_preferences", source: .db)
        return true
    } catch {
        Analytics.capture(.error, id: "update_user_preferences", 
                        longDescription: error.localizedDescription, source: .db)
        return false
    }
}
```

## Security

### Firestore Rules
```javascript
match /userPreferences/{userId} {
    allow read: if request.auth != null && 
                request.auth.uid == userId;
    
    allow write: if request.auth != null && 
                 request.auth.uid == userId &&
                 request.resource.data.userId == userId;
}
```

### Data Validation
1. Client-side validation in Swift
2. Server-side validation in Firebase Functions
3. Firestore Rules for data format validation

## Testing

### Manual Testing
1. Update preferences in app
2. Verify local storage update
3. Check Firebase update using tools
4. Verify real-time sync across devices

### Automated Testing
1. Unit tests for data conversion
2. Integration tests for Firebase sync
3. UI tests for preference updates

## Monitoring

### Analytics Events
1. `update_user_preferences_called`: When update is initiated
2. `update_user_preferences`: Success/failure of update
3. Error tracking with descriptions

### Logging
1. Client-side logs for user actions
2. Server-side logs for Firebase operations
3. Error logs with full context

## Future Improvements

### Short Term
1. Add batch updates for multiple changes
2. Implement offline support
3. Add data validation middleware

### Long Term
1. Add preference history tracking
2. Implement preference suggestions
3. Add preference analytics dashboard

## Troubleshooting Guide

### Common Issues
1. **Sync Delays**
   - Check network connectivity
   - Verify Firebase status
   - Check Analytics for errors

2. **Data Format Issues**
   - Verify time format (HH:mm)
   - Check chronotype mapping
   - Validate numeric values

3. **Authentication Issues**
   - Verify user login status
   - Check Firebase Auth state
   - Validate security rules

### Solutions
1. Implement retry mechanism
2. Add data validation
3. Improve error handling
4. Add user notifications for sync status 