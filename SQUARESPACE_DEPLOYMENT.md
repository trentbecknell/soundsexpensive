# Squarespace Deployment Guide

## Option 1: GitHub Pages + Squarespace Embed (Recommended)

### Step 1: Set up GitHub Pages

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for Squarespace deployment"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your GitHub repository settings
   - Navigate to "Pages" in the left sidebar
   - Under "Source", select "GitHub Actions"
   - The workflow will automatically deploy your app

3. **Your app will be available at**: 
   `https://[your-username].github.io/artist-roadmap/`

### Step 2: Embed in Squarespace

#### Method A: Full Page Embed
1. In Squarespace, create a new page
2. Add a "Code Block" 
3. Insert this HTML:

```html
<iframe 
  src="https://[your-username].github.io/artist-roadmap/" 
  width="100%" 
  height="800px" 
  frameborder="0"
  style="border: none; border-radius: 8px;">
</iframe>

<style>
  /* Hide Squarespace navigation on this page */
  .header-nav { display: none !important; }
  
  /* Make iframe responsive */
  @media (max-width: 768px) {
    iframe {
      height: 600px;
    }
  }
</style>
```

#### Method B: Section Embed
1. Add a "Code Block" to any page/section
2. Use this responsive embed code:

```html
<div class="artist-roadmap-embed">
  <iframe 
    src="https://[your-username].github.io/artist-roadmap/" 
    width="100%" 
    height="700px" 
    frameborder="0">
  </iframe>
</div>

<style>
  .artist-roadmap-embed {
    margin: 2rem 0;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  }
  
  .artist-roadmap-embed iframe {
    display: block;
    width: 100%;
    min-height: 700px;
  }
  
  @media (max-width: 768px) {
    .artist-roadmap-embed iframe {
      min-height: 600px;
    }
  }
</style>
```

## Option 2: Direct File Upload to Squarespace

### For Squarespace Business/Commerce Plans:

1. **Upload the built files**:
   - Upload contents of `dist/` folder to your Squarespace File Library
   - Note the URLs of uploaded files

2. **Create custom page**:
   - Use a blank page template
   - Add custom CSS/HTML with your file URLs

### Custom CSS for Squarespace Integration:

Add this to your Squarespace Custom CSS to match your site's design:

```css
/* Artist Roadmap Integration Styles */
.artist-roadmap-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Hide default Squarespace elements on app page */
.artist-roadmap-page .header-nav,
.artist-roadmap-page .footer-content {
  display: none !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .artist-roadmap-container {
    padding: 1rem;
  }
}
```

## Option 3: Netlify/Vercel + Squarespace (Alternative)

1. **Deploy to Netlify/Vercel** (drag and drop the `dist` folder)
2. **Get your deployment URL**
3. **Embed in Squarespace** using the iframe method above

## Benefits of Each Approach:

### GitHub Pages + Squarespace:
✅ Free hosting
✅ Automatic deployments when you update code
✅ Version control integration
✅ Easy to maintain

### Direct Squarespace Upload:
✅ All files hosted on your domain
✅ No external dependencies
✅ Potentially faster loading
❌ Manual updates required

## Next Steps:

1. Choose your preferred method
2. Update the GitHub repo name in `vite.config.ts` if different
3. Push to GitHub to trigger the first deployment
4. Test the embedded app in Squarespace
5. Customize the design to match your site

## Troubleshooting:

- **CORS Issues**: GitHub Pages should work fine, but if you encounter issues, try Netlify
- **Mobile Responsiveness**: Adjust iframe heights as needed
- **Squarespace Theme Conflicts**: Use more specific CSS selectors if styles clash

Let me know which method you'd like to proceed with!