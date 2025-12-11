# Slideshow Image Setup Instructions

This document explains how to add the actual images for the hero slideshow on the main page.

## Required Images

The slideshow requires the following 7 images:

### Background Images (6 total)
1. **WerewolfBG** - Werewolf-themed background
2. **WaterfallBG** - Waterfall background
3. **CastleBG** - Castle background
4. **NighttimefieldBG** - Nighttime field background
5. **ForestsunsetBG** - Forest sunset background
6. **BlacksmithBG** - Blacksmith background

### Logo Image (1 total)
7. **RollsLogoWebsiteHeader** - The Rolls logo to display centered on top of the slideshow

## How to Add Images

### Option 1: Using GitHub User Attachments (Recommended)

1. Upload your images to a GitHub issue or pull request comment
2. Copy the generated URL (format: `https://github.com/user-attachments/assets/...`)
3. Replace the placeholder URLs in `index.html` at lines 35-57

### Option 2: Using Local Files

1. Create an `assets` or `images` folder in the repository root
2. Add your images to that folder
3. Update the `src` attributes in `index.html` to point to the local files:
   ```html
   <img src="assets/werewolf-bg.jpg" alt="Werewolf Background">
   ```

## Current Placeholder URLs

The slideshow currently uses placeholder images from `via.placeholder.com`. You need to replace these URLs in `index.html`:

```html
<!-- Lines to update in index.html: -->
Line 37: Werewolf Background
Line 40: Waterfall Background
Line 43: Castle Background
Line 46: Nighttime Field Background
Line 49: Forest Sunset Background
Line 52: Blacksmith Background
Line 57: Rolls Logo Website Header (in logo-overlay div)
```

## Image Specifications

- **Background Images**: Recommended size 1200x500 pixels (or larger, will auto-resize)
- **Logo Image**: Recommended max-width 400 pixels, transparent background preferred
- **Format**: JPG or PNG for backgrounds, PNG for logo (for transparency)

## Testing

After adding images:
1. Open `index.html` in a browser
2. Verify all images load correctly
3. Test the navigation arrows (< and >)
4. Wait 20 seconds to confirm auto-advance works
5. Check that the logo stays centered and visible over all backgrounds
