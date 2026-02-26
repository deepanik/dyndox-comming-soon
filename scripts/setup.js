const fs = require('fs');
const path = require('path');

console.log('--- LAUNCHPAD Setup ---');

// 1. Create Data Directory
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
    console.log('[✓] Created data directory.');
}

// 2. Setup .env
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
        fs.copyFileSync(envExamplePath, envPath);
        console.log('[✓] Copied .env.example to .env.');
        console.log('[!] Please edit .env with your specific secrets.');
    } else {
        console.error('[✗] .env.example not found. Cannot create .env.');
    }
} else {
    console.log('[~] .env already exists.');
}

console.log('--- Setup Complete ---');
console.log('Next steps:');
console.log('1. npm install');
console.log('2. npm run dev');
