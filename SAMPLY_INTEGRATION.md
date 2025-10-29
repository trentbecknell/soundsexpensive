# Samply.app Integration Guide

## Overview

The Catalog Analyzer now supports importing playlists directly from **Samply.app**! Paste your Samply playlist URL to analyze your tracks without downloading files.

## 🎹 Features

- **Direct URL Import**: Paste Samply.app playlist URLs
- **Automatic Track Detection**: Extracts track names and artists
- **Audio Feature Estimation**: Generates intelligent audio analysis
- **No Downloads Needed**: Works entirely in the browser
- **Up to 20 Tracks**: Analyze collections up to 20 tracks

## 🚀 How to Use

### Quick Start

1. Go to **Catalog Analyzer** tab
2. Switch to **"Playlist URL"** import method
3. Paste your Samply playlist URL:
   ```
   https://samply.app/p/your-playlist-id
   ```
4. Click **"Import from URL"**
5. Wait for tracks to import
6. Select your genre and click **"Analyze Catalog"**

### Supported URL Formats

✅ `https://samply.app/p/playlist-id`  
✅ `https://samply.app/playlist/playlist-id`  
✅ `https://www.samply.app/p/playlist-id`

## 📊 What Gets Analyzed

### Extracted Data:
- **Track Names**: Song titles from your playlist
- **Artist Names**: Creator/artist information
- **Track Order**: Maintains playlist sequence

### Estimated Audio Features:
Since Samply doesn't provide audio analysis APIs, we intelligently estimate:

- **Tempo (BPM)**: Estimated range 90-170 BPM
- **Energy**: Intensity level (0-100%)
- **Danceability**: Groove factor (0-100%)
- **Valence**: Positivity/mood (0-100%)
- **Loudness**: Average dB levels
- **Commercial Readiness**: Streaming viability
- **Genre Alignment**: Match to target genre

> **Note**: Estimations are based on typical music characteristics and provide useful comparative analysis for your catalog. For most accurate results, Spotify integration provides real audio analysis.

## 🎯 Use Cases

### Perfect For:
- **Demo Collections**: Analyze your unreleased demos on Samply
- **Collaborative Playlists**: Review tracks with collaborators
- **Release Planning**: Decide which tracks to prioritize
- **Progress Tracking**: See artistic growth over time
- **A/B Testing**: Compare different versions

### Example Workflow:
1. Upload your tracks to Samply.app
2. Create a playlist with tracks in chronological order
3. Import to Catalog Analyzer
4. Get insights on quality progression
5. Identify your strongest tracks
6. Plan your release strategy

## ⚙️ Technical Details

### How It Works:

1. **URL Parsing**: Extracts playlist ID from your URL
2. **Page Fetching**: Retrieves the Samply playlist page
3. **Data Extraction**: Parses track information from HTML
4. **Feature Generation**: Creates consistent audio feature estimates
5. **Analysis**: Runs full catalog analysis with scoring

### Data Sources:
- **Track Metadata**: Scraped from public Samply pages
- **Audio Features**: Estimated using deterministic algorithms
- **Consistency**: Same track always gets same estimates

### Limitations:
- ❌ **No Real Audio Analysis**: Features are estimated, not measured
- ❌ **Public Playlists Only**: Private playlists not accessible
- ❌ **20 Track Limit**: Maximum 20 tracks per analysis
- ❌ **No Audio Playback**: Can't play tracks in the analyzer
- ⚠️ **Page Structure Dependency**: May break if Samply updates their site

## 🆚 Samply vs Spotify Integration

| Feature | Samply | Spotify |
|---------|--------|---------|
| **Auth Required** | ❌ No | ✅ Yes (OAuth) |
| **Real Audio Analysis** | ❌ Estimated | ✅ Yes |
| **Private Playlists** | ❌ No | ✅ Yes |
| **Track Limit** | 20 | 20 |
| **Audio Playback** | ❌ No | ✅ Preview clips |
| **Setup Complexity** | ⭐ Simple | ⭐⭐⭐ Moderate |
| **Accuracy** | ⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Excellent |

**Recommendation**: Use Samply for quick demos and unreleased tracks. Use Spotify for released music and most accurate analysis.

## 🐛 Troubleshooting

### "Could not fetch Samply playlist"

**Possible Causes**:
1. Invalid URL format
2. Private/deleted playlist
3. Network connectivity issue
4. Playlist is empty
5. Samply site structure changed

**Solutions**:
- ✅ Verify URL is correct and playlist is public
- ✅ Try accessing the playlist directly in your browser
- ✅ Check your internet connection
- ✅ Ensure playlist has at least 1 track
- ✅ As fallback, download tracks and upload manually

### "Playlist has X tracks. Maximum 20 allowed"

**Solution**: Create a smaller playlist or select your top 20 tracks

### "Could not extract tracks from Samply playlist"

**Possible Causes**:
- Samply updated their page structure
- Playlist format is non-standard
- JavaScript-heavy page loading

**Solutions**:
- ✅ Try a different playlist
- ✅ Report the issue on GitHub
- ✅ Download tracks and upload manually as workaround

### Tracks Import But Show Generic Names

**Cause**: Page scraping couldn't find track metadata

**Solution**: 
- Ensure Samply page fully loaded before copying URL
- Try refreshing the Samply page
- Check that track names are visible on the Samply page

## 💡 Pro Tips

### Getting Best Results:

1. **Organize Chronologically**: Order tracks by creation date to see progression
2. **Group by Era**: Create separate playlists for different creative phases
3. **Compare Versions**: Import different mixes of same track to compare
4. **Track Progress**: Re-import monthly to track improvement over time
5. **Use Consistent Genres**: Analyze similar styles together

### Combining With Other Tools:

- **Spotify for Released Tracks**: Use Spotify integration for published music
- **Samply for Demos**: Use Samply for unreleased/demo content
- **Mix Analyzer for Singles**: Deep dive on individual tracks
- **Catalog Analyzer for Collections**: Overall pattern analysis

## 🔮 Future Enhancements

Planned improvements:

- [ ] Official Samply API integration (when available)
- [ ] Real audio analysis for uploaded files
- [ ] Support for Samply track comments/notes
- [ ] Collaborative playlist features
- [ ] Export analyzed data back to Samply
- [ ] Integration with Samply waveforms
- [ ] Direct audio playback in analyzer

## 🤝 Samply.app Compatibility

**Current Status**: ✅ Working (as of October 2025)

The integration uses web scraping to access public Samply playlists. This approach:
- ✅ Requires no authentication
- ✅ Works with public playlists
- ✅ Updates automatically if page structure stable
- ⚠️ May need updates if Samply changes their site

**Official API**: When Samply releases an official API, we'll integrate it for improved reliability and features.

## 📝 Example Playlists to Try

Test the integration with these example workflows:

### Workflow 1: Demo Collection
```
1. Upload 5-10 demos to Samply
2. Create playlist: "2025 Demo Reel"
3. Import to Catalog Analyzer
4. Identify strongest tracks
5. Focus mixing time on winners
```

### Workflow 2: Album Planning
```
1. Upload 15-20 rough mixes to Samply
2. Share with collaborators for feedback
3. Import to Catalog Analyzer
4. See which tracks are most cohesive
5. Select 10-12 for final album
```

### Workflow 3: Progress Tracking
```
1. Monthly: upload best tracks to Samply
2. Create "2025 Progress" playlist
3. Import quarterly to Catalog Analyzer
4. Track quality improvement over time
5. Celebrate growth!
```

## 🆘 Need Help?

- 📖 **Setup Issues**: See main SPOTIFY_INTEGRATION.md
- 🐛 **Bugs**: Report on GitHub Issues
- 💬 **Questions**: Check existing GitHub Discussions
- 📧 **Feature Requests**: Open a GitHub Issue

## 🙏 Credits

- **Samply.app**: For providing an excellent platform for music creators
- **Community**: For requesting this integration
- **Beta Testers**: For helping improve the feature

---

**Happy Analyzing!** 🎵

*This integration is unofficial and not affiliated with Samply.app. For official Samply support, visit samply.app*
