"""Quick fix: Remove leading '3' from pi-digits.js"""
import re

with open('pi-digits.js', 'r', encoding='utf-8') as f:
    content = f.read()

# The digits currently start with '3141592...' but should start with '1415926...'
# Remove the leading '3' from PI_OFFLINE_DIGITS
content = content.replace("PI_OFFLINE_DIGITS = '3", "PI_OFFLINE_DIGITS = '", 1)

with open('pi-digits.js', 'w', encoding='utf-8') as f:
    f.write(content)

# Verify
with open('pi-digits.js', 'r', encoding='utf-8') as f:
    check = f.read()
    
match = re.search(r"PI_OFFLINE_DIGITS = '(\d{50})", check)
if match:
    print(f"✓ Fixed! First 50 digits: {match.group(1)}")
    if match.group(1).startswith('14159'):
        print("✓ Correct! Digits now start with 14159...")
    else:
        print("⚠ Warning: Digits don't start with expected 14159")



