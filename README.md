# Stake Ad Chrome Extension

Turn every image on the internet into a sponsored post! This satirical Chrome extension pokes fun at all the Stake advertisements all over twitter by letting you add them to every image on the internet.

## What it does

This extension automatically processes images on any webpage you visit, adding:
- A white separator line
- A black promotional bar
- Your choice of logo
- Customizable promotional text

## Installation

1. Clone this repository or download the files
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Customization

### Changing the Logo

1. Add your logo image file to the extension directory
2. Add the filename to `web_accessible_resources` in `manifest.json`: 

```json
"web_accessible_resources": [{
"resources": ["stakelogo.png", "raisingcaneslogo.png", "your-logo.png"],
"matches": ["<all_urls>"]
}]
```

3. Update the logo reference in `content.js` (around line 95):

```javascript
logoImg.src = chrome.runtime.getURL('your-logo.png');
```

### Changing the Promotional Text

Update the text variable in `content.js` (around line 52):

```javascript
const text = 'GAMBLE RESPONSIBLY | #AD'; // Change to your desired message
```

### Pre-included Alternatives

The extension comes with two sample logos:
- `stakelogo.png` (default)
- `raisingcaneslogo.png` (alternative example)

## Notes

- The extension skips images smaller than 100x100 pixels
- Images are processed only once to avoid repeated modifications
- The extension works on dynamically loaded content

## Disclaimer

This is a parody extension created for educational and entertainment purposes. It is not affiliated with any gambling or food service companies.

## License

MIT License - Feel free to modify and distribute as you see fit!