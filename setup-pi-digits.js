/**
 * Setup Script: Download 100,000 digits of Pi
 * 
 * Run this once with Node.js:
 *   node setup-pi-digits.js
 * 
 * This will create pi-digits.js with 100,000 offline digits
 */

const https = require('https');
const fs = require('fs');

const TOTAL_DIGITS = 100000;
const CHUNK_SIZE = 10000;
const API_URL = 'https://api.pi.delivery/v1/pi';

async function fetchChunk(start, count) {
    return new Promise((resolve, reject) => {
        const url = `${API_URL}?start=${start}&numberOfDigits=${count}`;
        console.log(`Fetching digits ${start.toLocaleString()} - ${(start + count).toLocaleString()}...`);
        
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json.content);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function main() {
    console.log('π∞ Pi Digits Setup');
    console.log('==================');
    console.log(`Downloading ${TOTAL_DIGITS.toLocaleString()} digits of Pi...\n`);
    
    let allDigits = '';
    
    for (let start = 0; start < TOTAL_DIGITS; start += CHUNK_SIZE) {
        const count = Math.min(CHUNK_SIZE, TOTAL_DIGITS - start);
        try {
            const digits = await fetchChunk(start, count);
            allDigits += digits;
            console.log(`  ✓ Progress: ${allDigits.length.toLocaleString()} / ${TOTAL_DIGITS.toLocaleString()}`);
            
            // Small delay to be nice to the API
            await new Promise(r => setTimeout(r, 500));
        } catch (error) {
            console.error(`  ✗ Error at ${start}:`, error.message);
            process.exit(1);
        }
    }
    
    // Create the pi-digits.js file
    const fileContent = `/**
 * π∞ Offline Pi Digits
 * ${TOTAL_DIGITS.toLocaleString()} digits of Pi (after decimal point)
 * Generated: ${new Date().toISOString()}
 * 
 * Usage: The PiDigitsManager will use this for offline access
 */

const PI_OFFLINE_DIGITS = '${allDigits}';
`;
    
    fs.writeFileSync('pi-digits.js', fileContent);
    
    console.log('\n==================');
    console.log(`✓ Success! Created pi-digits.js with ${allDigits.length.toLocaleString()} digits`);
    console.log(`  File size: ${(fileContent.length / 1024).toFixed(1)} KB`);
    console.log('\nFirst 50 digits: 3.' + allDigits.slice(0, 50) + '...');
}

main().catch(console.error);



