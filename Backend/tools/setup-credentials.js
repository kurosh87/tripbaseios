const fs = require('fs');
const path = require('path');

const TEMPLATE_PATH = '../firebase-func/functions/tripbase-7f203-firebase-adminsdk-fbsvc-fe9727f3b7.template.json';
const CREDENTIALS_PATH = '../firebase-func/functions/tripbase-7f203-firebase-adminsdk-fbsvc-fe9727f3b7.json';

function setupCredentials() {
    try {
        // Check if credentials file already exists
        if (fs.existsSync(path.resolve(__dirname, CREDENTIALS_PATH))) {
            console.log('⚠️  Credentials file already exists. Please remove it first if you want to create a new one.');
            return;
        }

        // Copy template to new credentials file
        fs.copyFileSync(
            path.resolve(__dirname, TEMPLATE_PATH),
            path.resolve(__dirname, CREDENTIALS_PATH)
        );

        console.log('✅ Credentials template copied successfully!');
        console.log('\nNext steps:');
        console.log('1. Open the new file:', CREDENTIALS_PATH);
        console.log('2. Replace placeholder values with your actual Firebase credentials');
        console.log('3. Keep this file secure and never commit it to version control\n');

    } catch (error) {
        console.error('❌ Error setting up credentials:', error.message);
        process.exit(1);
    }
}

setupCredentials(); 