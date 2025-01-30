const express = require('express');
const cors = require('cors');
const instagramGetUrl = require('instagram-url-direct');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/download', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!url.includes('instagram.com')) {
      return res.status(400).json({ error: 'Invalid Instagram URL' });
    }

    const response = await instagramGetUrl(url);
    
    if (!response.url_list || response.url_list.length === 0) {
      return res.status(404).json({ error: 'No video found' });
    }

    res.json({ videoUrl: response.url_list[0] });
  } catch (error) {
    console.error('Error downloading video:', error);
    res.status(500).json({ error: 'Failed to download video' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});