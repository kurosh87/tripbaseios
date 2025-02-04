export interface UserPreferences {
    // Sleep Schedule
    wakeUpTime: string;  // Format: "HH:mm"
    bedTime: string;     // Format: "HH:mm"
    
    // Sleep Aid Preferences
    useMelatonin: boolean;
    melatoninDosage?: number;  // in mg, optional
    
    // Chronotype
    chronotype: 'EARLY_BIRD' | 'NIGHT_OWL' | 'INTERMEDIATE';
    
    // Caffeine Preferences
    caffeineSensitivity: 'LOW' | 'MEDIUM' | 'HIGH';
    maxDailyCaffeine?: number;  // in mg, optional
    
    // Metadata
    lastUpdated: string;  // ISO timestamp
    userId: string;       // Firebase Auth UID
}

// Default preferences for new users
export const DEFAULT_USER_PREFERENCES: Omit<UserPreferences, 'userId'> = {
    wakeUpTime: "07:00",
    bedTime: "23:00",
    useMelatonin: false,
    chronotype: 'INTERMEDIATE',
    caffeineSensitivity: 'MEDIUM',
    lastUpdated: new Date().toISOString()
}; 