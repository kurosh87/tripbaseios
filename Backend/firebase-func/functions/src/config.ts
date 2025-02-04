//
// config.ts
// Firebase Functions Configuration
//

// Configuration for various API keys and settings
// Replace these with your actual keys in your local development environment
// DO NOT commit actual keys to version control

export const config = {
    // OpenAI Configuration
    openAIApiKey: "YOUR_OPENAI_API_KEY", // Add your OpenAI API key locally

    // Firebase Configuration
    firebase: {
        apiKey: "YOUR_FIREBASE_API_KEY",
        // Add other Firebase config here
    },

    // Other configurations
    environment: process.env.NODE_ENV || 'development',
    
    // Add any other configuration settings here
}; 