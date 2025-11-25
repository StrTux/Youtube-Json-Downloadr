# YouTube Playlist JSON Downloader

A simple Node.js backend application that fetches all video details from any YouTube playlist and downloads them as a JSON file.

## Features

- ✅ Fetch complete playlist data (video ID, title, thumbnails, description, publish date)
- ✅ Handle large playlists with automatic pagination
- ✅ Download results as JSON file
- ✅ Simple REST API endpoint
- ✅ No frontend required
- ✅ Secure API key management

## Prerequisites

- Node.js (v14 or higher)
- YouTube Data API v3 Key ([Get it here](https://console.cloud.google.com/apis/credentials))

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API Key:**
   - Open `.env.local` file
   - Replace `YOUR_YOUTUBE_API_KEY_HERE` with your actual YouTube Data API v3 key

3. **Start the server:**
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

## Usage

### Get Playlist Data

Open your browser or use curl/Postman:

```
http://localhost:5000/api/playlist-json?playlistUrl=YOUR_PLAYLIST_URL
```

#### Examples:

**With full YouTube URL:**
```
http://localhost:5000/api/playlist-json?playlistUrl=https://www.youtube.com/playlist?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf
```

**With playlist ID only:**
```
http://localhost:5000/api/playlist-json?playlistUrl=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf
```

### Response Format

The API returns a JSON file with the following structure:

```json
{
  "playlistId": "PLxxxxx",
  "totalVideos": 50,
  "fetchedAt": "2025-11-15T05:53:00.000Z",
  "videos": [
    {
      "videoId": "dQw4w9WgXcQ",
      "title": "Video Title",
      "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg",
      "thumbnailMedium": "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
      "thumbnailHigh": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      "description": "Video description...",
      "publishedAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check and API info |
| `/api/playlist-json` | GET | Fetch playlist and download as JSON |

## Getting YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **YouTube Data API v3**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy the API key and paste it in `.env.local`

## Testing with cURL

```bash
curl "http://localhost:5000/api/playlist-json?playlistUrl=YOUR_PLAYLIST_URL" -o playlist.json
```

## Troubleshooting

**Error: "YouTube API key not configured"**
- Make sure you've added your API key in `.env.local`

**Error: "Invalid playlist URL or ID"**
- Check if the playlist URL is correct
- Make sure the playlist is public

**Error: "YouTube API error: quotaExceeded"**
- You've reached the daily API quota limit
- Wait for 24 hours or create a new API key

## Project Structure

```
yt-playlist-json-downloader/
├── index.js          # Main Express server
├── package.json      # Dependencies and scripts
├── .env.local        # API key configuration
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## License

MIT

## Author

Created for easy YouTube playlist data extraction.
