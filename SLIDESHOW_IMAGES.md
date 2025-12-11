# Slideshow Image Setup Instructions

This document explains how to add the actual images for the hero slideshow on the main page.

## Required Images

The slideshow requires the following 10 WEBP images:

### Background Images (9 total)
1. **BlacksmithBG.webp** - Blacksmith-themed background
2. **WaterfallBG.webp** - Waterfall background
3. **NightfieldBG.webp** - Nighttime field background
4. **SunsetBG.webp** - Sunset background
5. **LavaCaveBG.webp** - Lava cave background
6. **CrystalCaveBG.webp** - Crystal cave background
7. **IceLakeBG.webp** - Ice lake background
8. **AuroraSnowBG.webp** - Aurora snow background
9. **RustCityBG.webp** - Rust city background

### Logo Image (1 total)
10. **RollsLogoWebsiteHeader.webp** - The Rolls logo to display centered on top of the slideshow

## How to Add Images

### Adding Your Images

1. Create or obtain your background images and logo in WEBP format
2. Name them exactly as specified above
3. Place them in the repository root directory (same location as `index.html`)
4. The slideshow will automatically display them

### Image Specifications

- **Background Images**: Recommended size 1920x1080 pixels (Full HD) or larger
- **Logo Image**: Recommended max-width 800 pixels, transparent background preferred
- **Format**: WEBP (required for optimal web performance and modern browser support)

## Current Implementation

The slideshow currently uses placeholder images created with Python. These are included in `.gitignore` and should be replaced with your actual assets.

To replace placeholders:
1. Remove or rename the placeholder .webp files
2. Add your actual WEBP images with the exact names listed above
3. Refresh the page to see your images

## Layout Features

- **Full-page background**: Images cover the entire viewport
- **Centered logo**: Logo is positioned at 45% from top, centered horizontally
- **Bottom game buttons**: TTRPG game selection buttons appear at the bottom with gradient overlay
- **Auto-advance**: Slides change every 20 seconds
- **Manual navigation**: Arrow buttons on left (<) and right (>) sides
- **Smooth transitions**: 1.5 second fade between slides

## Testing

After adding images:
1. Open `index.html` in a browser
2. Verify all images load correctly
3. Test the navigation arrows (< and >)
4. Wait 20 seconds to confirm auto-advance works
5. Check that the logo stays centered and visible over all backgrounds
6. Verify game buttons appear correctly at the bottom
