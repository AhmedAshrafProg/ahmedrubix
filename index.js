require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/postToFacebook', async (req, res) => {
  const facebookAccessToken = 'eb0aa5f9f68fd96a739557a64b3b8945';
  const lockerStudioApiKey = '0b48aff1935bf41a7ef5ac51c12d8026aafdf8d5';

  const postContent = {
    message: 'Your message here',
    // Add other post parameters as needed
  };

  try {
    // Post to Facebook
    const fbResponse = await axios.post(
      `https://graph.facebook.com/v13.0/me/feed?access_token=${facebookAccessToken}`,
      postContent
    );

    // Check if the post was successful
    if (fbResponse.data && fbResponse.data.id) {
      const facebookPostId = fbResponse.data.id;

      // Prepare data for Locker Studio
      const lockerStudioData = {
        facebookPostId: facebookPostId,
        content: postContent.message,
        // Add other relevant data
      };

      // Send data to Locker Studio
      const lockerStudioResponse = await axios.post(
        'https://lookerstudio.google.com/u/0/navigation/reporting',
        lockerStudioData,
        {
          headers: {
            Authorization: `Bearer ${lockerStudioApiKey}`,
            // Add other necessary headers
          },
        }
      );

      // Success response
      res.json({
        message: 'Post created and sent to Locker Studio',
        lockerStudioResponse: lockerStudioResponse.data,
      });
    } else {
      throw new Error('Failed to post to Facebook');
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('An error occurred');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
