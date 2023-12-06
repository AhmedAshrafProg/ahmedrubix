const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());
const LOCKER_STUDIO_API_KEY = '0b48aff1935bf41a7ef5ac51c12d8026aafdf8d5';
const FB_ACCESS_TOKEN = 'eb0aa5f9f68fd96a739557a64b3b8945';
// Function to post to Facebook
const postToFacebook = async (message) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v10.0/me/feed`,
      {
        message: message,
      },
      {
        params: {
          access_token: FB_ACCESS_TOKEN,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to save post details to Locker Studio
const saveToLockerStudio = async (postDetails) => {
  try {
    const response = await axios.post(
      'https://lookerstudio.google.com/u/0/navigation/reporting', // Replace with actual API
      postDetails,
      {
        headers: {
          Authorization: `Bearer ${LOCKER_STUDIO_API_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

app.post('/post-and-save', async (req, res) => {
  try {
    // Post to Facebook
    const fbPost = await postToFacebook(req.body.message);

    // Save post details to Locker Studio
    const savedPost = await saveToLockerStudio({
      postId: fbPost.id,
      message: req.body.message,
    });

    res.json({ facebook: fbPost, lockerStudio: savedPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
