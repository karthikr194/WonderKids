# PWA Icons Setup

This app is configured as a Progressive Web App (PWA). To complete the setup, you'll need to generate the required icon files.

## Required Icons

The manifest.json references two icon sizes:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

## How to Generate Icons

### Option 1: Use an Online Tool
1. Visit a PWA icon generator like:
   - https://www.pwabuilder.com/imageGenerator
   - https://realfavicongenerator.net/
2. Upload your logo/icon (512x512 recommended)
3. Download the generated icons
4. Place `icon-192.png` and `icon-512.png` in the `public/` folder

### Option 2: Use the SVG Template
We've provided an `icon.svg` file in the `public/` folder. You can:
1. Convert it to PNG using an online converter or tool
2. Generate both 192x192 and 512x512 versions
3. Save them as `icon-192.png` and `icon-512.png`

### Option 3: Manual Creation
Create PNG files with your design:
- `public/icon-192.png` - 192x192 pixels
- `public/icon-512.png` - 512x512 pixels

## Testing Your PWA

1. Build the app: `npm run build`
2. Serve it: `npm run preview`
3. Open Chrome DevTools > Application > Manifest
4. Check for any errors
5. Test "Add to Home Screen" on mobile

## Note
Until you add the actual icon files, the browser will show a warning in the console, but the app will still function normally.
