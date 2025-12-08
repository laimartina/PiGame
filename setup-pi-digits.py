"""
Setup Script: Download 100,000 digits of Pi

Run with Python:
    python setup-pi-digits.py

This will create pi-digits.js with 100,000 offline digits
"""

import urllib.request
import json
import time
import sys

TOTAL_DIGITS = 100000
CHUNK_SIZE = 1000  # Smaller chunks for reliability

def fetch_chunk(start, count):
    # Try multiple APIs
    apis = [
        f'https://api.pi.delivery/v1/pi?start={start}&numberOfDigits={count}',
        f'https://newton.ex.ac.uk/research/qsystems/collabs/pi/pi6.txt',
    ]
    
    # Use a simpler approach - fetch from a text file
    url = f'https://raw.githubusercontent.com/ehsan/pi/master/pi-billion.txt'
    
    print(f'Fetching digits {start:,} - {start + count:,}...')
    
    try:
        req = urllib.request.Request(
            f'https://api.pi.delivery/v1/pi?start={start}&numberOfDigits={count}',
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        )
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode())
            return data.get('content', '')
    except Exception as e:
        print(f'  Error: {e}')
        return None

def main():
    print('π∞ Pi Digits Setup')
    print('==================')
    print(f'Downloading {TOTAL_DIGITS:,} digits of Pi...\n')
    
    all_digits = ''
    
    for start in range(0, TOTAL_DIGITS, CHUNK_SIZE):
        count = min(CHUNK_SIZE, TOTAL_DIGITS - start)
        digits = fetch_chunk(start, count)
        
        if digits is None:
            print(f'  ✗ Failed to fetch chunk at {start}')
            sys.exit(1)
        
        all_digits += digits
        print(f'  ✓ Progress: {len(all_digits):,} / {TOTAL_DIGITS:,}')
        
        # Small delay to be nice to the API
        time.sleep(0.5)
    
    # Create the pi-digits.js file
    from datetime import datetime
    file_content = f'''/**
 * π∞ Offline Pi Digits
 * {TOTAL_DIGITS:,} digits of Pi (after decimal point)
 * Generated: {datetime.now().isoformat()}
 * 
 * Usage: The PiDigitsManager will use this for offline access
 */

const PI_OFFLINE_DIGITS = '{all_digits}';
'''
    
    with open('pi-digits.js', 'w', encoding='utf-8') as f:
        f.write(file_content)
    
    print('\n==================')
    print(f'✓ Success! Created pi-digits.js with {len(all_digits):,} digits')
    print(f'  File size: {len(file_content) / 1024:.1f} KB')
    print(f'\nFirst 50 digits: 3.{all_digits[:50]}...')

if __name__ == '__main__':
    main()

