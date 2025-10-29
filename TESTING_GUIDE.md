# Quick Testing Guide - Spotify Integration v1.3.0

## 🚀 Your Build is Live!

**Live URL**: https://trentbecknell.github.io/soundsexpensive/  
**Release**: https://github.com/trentbecknell/soundsexpensive/releases/tag/v1.3.0

---

## ⚠️ IMPORTANT: Before Testing

### You Need to Set Up Spotify API Credentials

The Spotify integration **requires** a Client ID to work. Here's the quick setup:

### 1. Create Spotify Developer App (5 minutes)

1. Go to: https://developer.spotify.com/dashboard
2. Log in with your Spotify account
3. Click **"Create app"**
4. Fill in:
   - **App name**: `Sounds Expensive`
   - **App description**: `Music analysis tool`
   - **Redirect URI**: `https://trentbecknell.github.io/soundsexpensive/`
   - **APIs**: Select "Web API"
5. Accept Terms → Click **"Save"**
6. Click **"Settings"** → Copy your **Client ID**

### 2. Add Client ID to Your Build

**Option A: Rebuild with Environment Variable** (Recommended for testing)
```bash
# In your codespace terminal:
echo "VITE_SPOTIFY_CLIENT_ID=your_client_id_here" > .env
npm run build
npm run deploy
```

**Option B: Hardcode for Quick Testing**
Edit `src/lib/spotifyApi.ts` line 4-5:
```typescript
const SPOTIFY_CLIENT_ID = 'your_actual_client_id_here';
const SPOTIFY_REDIRECT_URI = 'https://trentbecknell.github.io/soundsexpensive/';
```
Then rebuild and deploy:
```bash
npm run build
npm run deploy
```

### 3. Configure Redirect URI in Spotify Dashboard

Make sure your Spotify app has this **exact** redirect URI:
```
https://trentbecknell.github.io/soundsexpensive/
```
(trailing slash matters!)

---

## ✅ Testing Checklist

Once you've set up the Client ID and redeployed:

### Basic Flow:
1. [ ] Visit https://trentbecknell.github.io/soundsexpensive/
2. [ ] Click **"Catalog Analyzer"** tab
3. [ ] Switch to **"Playlist URL"** import method
4. [ ] Verify "Spotify Not Connected" yellow banner shows
5. [ ] Click **"Connect Spotify"** button
6. [ ] Should redirect to Spotify authorization page
7. [ ] Click **"Agree"** to authorize the app
8. [ ] Should redirect back and show "Successfully Connected!"
9. [ ] Banner should turn green with "Spotify Connected ✓"

### Import Test:
10. [ ] Paste a Spotify playlist URL (try these):
    - Your own playlist
    - Public playlist: `https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M`
11. [ ] Click **"Import from URL"**
12. [ ] Should show "🔄 Importing..." loading state
13. [ ] Tracks should appear in the list (max 20)
14. [ ] Verify track names and artists are correct

### Analysis Test:
15. [ ] Select a genre (e.g., "Pop")
16. [ ] Click **"Analyze Catalog"**
17. [ ] Wait for analysis to complete
18. [ ] Verify results show:
    - Overall score
    - Quality progression chart
    - Track-by-track breakdown
    - Sonic identity analysis
    - Regional market recommendations

### Error Handling:
19. [ ] Try pasting invalid URL → should show error
20. [ ] Try importing playlist with >20 tracks → should show error
21. [ ] Click **"Disconnect"** → should clear connection
22. [ ] Try importing without reconnecting → should prompt to connect

### Other Features (Should Still Work):
23. [ ] Try **"Upload Files"** method → should work as before
24. [ ] Upload 2-3 audio files manually
25. [ ] Run analysis on uploaded files
26. [ ] Switch to **"Mix Analyzer"** tab → should work
27. [ ] Test roadmap features → should work

---

## 🐛 Common Issues & Fixes

### "Not authenticated" error
**Cause**: No Client ID or invalid token  
**Fix**: 
1. Verify Client ID is set in environment variable
2. Rebuild and redeploy
3. Try disconnecting and reconnecting Spotify

### Infinite redirect loop
**Cause**: Redirect URI mismatch  
**Fix**: 
1. Check Spotify Dashboard redirect URI matches exactly
2. Must be: `https://trentbecknell.github.io/soundsexpensive/`
3. Trailing slash is important!

### "Invalid Client" error
**Cause**: Wrong Client ID  
**Fix**: 
1. Double-check you copied the correct Client ID
2. No spaces or extra characters
3. Rebuild and redeploy

### Import button disabled
**Cause**: Not connected to Spotify  
**Fix**: Click "Connect Spotify" first

### No tracks imported
**Cause**: Playlist is private or empty  
**Fix**: 
1. Use a public playlist
2. Or ensure you're logged into the Spotify account that owns the playlist

---

## 📊 What to Test For

### Functionality:
- ✅ OAuth flow works smoothly
- ✅ Token persists across page refreshes
- ✅ Playlist imports successfully
- ✅ Audio features are analyzed correctly
- ✅ Genre-specific scoring makes sense
- ✅ Charts and visualizations display properly

### User Experience:
- ✅ Loading states are clear
- ✅ Error messages are helpful
- ✅ Connection status is obvious
- ✅ Mobile layout works well
- ✅ Buttons and inputs are responsive

### Edge Cases:
- ✅ Empty playlists handled
- ✅ Large playlists (>20 tracks) rejected
- ✅ Invalid URLs caught
- ✅ Network errors handled gracefully
- ✅ Token expiry triggers refresh

---

## 📸 What You Should See

### Before Connecting:
```
[⚠ Spotify Not Connected]
[Connect Spotify] button
```

### After Connecting:
```
[✓ Spotify Connected] [Disconnect]
Paste playlist URL → [Import from URL]
```

### During Import:
```
🔄 Importing...
(loading spinner)
```

### After Import:
```
3 tracks uploaded
1. Song Name - Artist Name
2. Another Song - Artist Name
3. Third Song - Artist Name
[Analyze Catalog] button
```

---

## 🎯 Success Criteria

Your integration is working if:

1. ✅ You can connect to Spotify without errors
2. ✅ You can paste a playlist URL and import tracks
3. ✅ Tracks show correct names and artists
4. ✅ Analysis runs and produces scores
5. ✅ You can disconnect and reconnect
6. ✅ File upload method still works independently

---

## 📞 Need Help?

If something isn't working:

1. **Check Browser Console** (F12) for errors
2. **Verify Client ID** is correctly set
3. **Check Redirect URI** matches exactly
4. **Try in Incognito Mode** (clears cookies/cache)
5. **Check Network Tab** to see API calls

Common console errors:
- `Failed to fetch` → Network issue or wrong Client ID
- `Invalid client` → Client ID is wrong
- `Redirect URI mismatch` → Fix in Spotify Dashboard

---

## 🚀 Next Steps After Testing

Once everything works:

1. **Set up GitHub Secrets** for automatic deployments:
   - Go to: https://github.com/trentbecknell/soundsexpensive/settings/secrets/actions
   - Add secret: `VITE_SPOTIFY_CLIENT_ID`
   - Update `.github/workflows/deploy.yml` to use it

2. **Share with beta testers**
   - They'll need to connect their own Spotify accounts
   - No additional setup needed on their end

3. **Monitor usage**
   - Watch for any reported issues
   - Check if rate limits are hit (unlikely with normal use)

---

## 📝 Testing Notes Template

Use this to track your testing:

```
Date: _______
Tester: _______
Browser: _______
Device: _______

✅ / ❌  Connect Spotify
✅ / ❌  Import public playlist
✅ / ❌  Import private playlist
✅ / ❌  Run analysis
✅ / ❌  View results
✅ / ❌  Disconnect Spotify
✅ / ❌  File upload still works
✅ / ❌  Mobile responsive

Issues found:
1. _______
2. _______

Notes:
_______
```

---

## 🎉 You're All Set!

Once you've added the Client ID and redeployed, the Spotify integration will be fully functional. Happy testing! 🚀

**Remember**: The Client ID is public and safe to expose in your repository. It's designed to be client-side.

**Questions?** Check the release notes or open an issue on GitHub.
