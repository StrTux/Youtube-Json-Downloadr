require("dotenv").config({ path: ".env.local" });
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static("public"));

/**
 * Extract playlistId from YouTube URL or return direct playlistId
 */
function extractPlaylistId(input) {
  if (!input) return null;

  try {
    const url = new URL(input);
    const params = url.searchParams;
    return params.get("list");
  } catch {
    // Not a valid URL, assume it's the playlistId itself
    return input.trim();
  }
}

/**
 * Main endpoint to fetch playlist videos and download as JSON
 * GET /api/playlist-json?playlistUrl=YOUR_PLAYLIST_URL_OR_ID
 */
app.get("/api/playlist-json", async (req, res) => {
  const playlistInput = req.query.playlistUrl;

  if (!playlistInput) {
    return res.status(400).json({ 
      error: "playlistUrl query parameter is required",
      example: "/api/playlist-json?playlistUrl=https://www.youtube.com/playlist?list=PLxxxxxx"
    });
  }

  const playlistId = extractPlaylistId(playlistInput);

  if (!playlistId) {
    return res.status(400).json({ error: "Invalid playlist URL or ID" });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ 
      error: "YouTube API key not configured. Please add YOUTUBE_API_KEY in .env.local file" 
    });
  }

  let allVideos = [];
  let nextPageToken = "";
  let totalRequests = 0;
  const maxRequests = 20; // Safety limit for pagination

  try {
    console.log(`Fetching playlist: ${playlistId}`);

    do {
      totalRequests++;

      if (totalRequests > maxRequests) {
        console.warn("Max pagination requests reached");
        break;
      }

      const ytResponse = await axios.get(
        "https://www.googleapis.com/youtube/v3/playlistItems",
        {
          params: {
            part: "snippet",
            playlistId: playlistId,
            maxResults: 50,
            pageToken: nextPageToken || undefined,
            key: apiKey,
          },
        }
      );

      const items = ytResponse.data.items || [];

      items.forEach((item) => {
        const snippet = item.snippet;
        allVideos.push({
          videoId: snippet.resourceId.videoId,
          title: snippet.title,
          thumbnail: snippet.thumbnails.default.url,
          thumbnailMedium: snippet.thumbnails.medium?.url || "",
          thumbnailHigh: snippet.thumbnails.high?.url || "",
          description: snippet.description || "",
          publishedAt: snippet.publishedAt || "",
        });
      });

      nextPageToken = ytResponse.data.nextPageToken;
      console.log(`Fetched ${items.length} videos (Total: ${allVideos.length})`);

    } while (nextPageToken);

    console.log(`✅ Successfully fetched ${allVideos.length} videos from playlist`);

    // Set headers for JSON download
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=playlist_${playlistId}.json`
    );

    res.json({
      playlistId: playlistId,
      totalVideos: allVideos.length,
      fetchedAt: new Date().toISOString(),
      videos: allVideos,
    });

  } catch (error) {
    console.error("Error fetching playlist:", error.message);

    if (error.response) {
      return res.status(error.response.status).json({
        error: "YouTube API error",
        message: error.response.data.error?.message || error.message,
        statusCode: error.response.status,
      });
    }

    res.status(500).json({
      error: "Failed to fetch playlist",
      message: error.message,
    });
  }
});



/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📋 API Endpoint: http://localhost:${PORT}/api/playlist-json?playlistUrl=YOUR_PLAYLIST_URL\n`);
});
