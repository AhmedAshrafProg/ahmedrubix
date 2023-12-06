const express = require('express');
const axios = require('axios');
const { google } = require('googleapis');

const app = express();

const oauth2Client = new google.auth.OAuth2(
  '109158458053-9lmliub68u1a73h5u9lb61h33bf9q4ua.apps.googleusercontent.com', // Replace with your Client ID
  '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', // Replace with your Client Secret
  'https://docs.google.com/spreadsheets/u/0/' // Replace with your Redirect URI
);

// Function to save data to Google Sheets
async function saveDataToGoogleSheets(data) {
  const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
  const spreadsheetId =
    'https://docs.google.com/spreadsheets/d/1Eptk486S8-DSBVTITRhUrya7fU9bc1PTV7yL8cGIcN8/edit#gid=0'; // Replace with your Spreadsheet ID
  const range = 'Sheet1!A1'; // Update as per your sheet's requirements

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      resource: {
        values: [data], // Ensure your data is in the format that the Sheets API expects
      },
    });
  } catch (error) {
    console.error('Error saving data to Google Sheets:', error);
    throw error;
  }
}
async function fetchFacebookPageData(pageId) {
  const accessToken =
    'EAAJOiz3G0e0BO0PBBi00anaZBztqoLDVQcZC7sAYTaKF0QZBTSHYK5ZBvOyb8G5dLFzSBMkcnp8RalscT6gxtLmr0wNWSKVzKtrNMMk1WJFhmaQu7l1vgTyX0XmVICKx4UkyGuTEuZBMzoTBQPZBlbf3L7VIQHozMn4CH7YGoOT41XYVuST1ZAZA6ZC0grhVeQZAkegXKXT4yQ0fKVRRXELM7Oj1MWNo0esYHYSRmkFQUhUbOy'; // تأكد من تعيين هذا في ملف .env
  const url = `https://graph.facebook.com/${pageId}?fields=id,name,posts&access_token=${accessToken}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data from Facebook:', error);
    throw error;
  }
}
// Your existing code for fetching Facebook page data

app.get('/', async (req, res) => {
  try {
    const pageId =
      'https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=396545775179129&business_id=876005783288351&nav_entry_point=bm_ad_account_open_in_ads_manager_button&date=2021-10-15_2023-12-07%2Cmaximum&comparison_date=&insights_date=2021-10-15_2023-12-07%2Cmaximum&insights_comparison_date=&breakdown_regrouping=true';
    const fbData = await fetchFacebookPageData(pageId);
    await saveDataToGoogleSheets(Object.values(fbData)); // Assuming fbData is an object; modify as needed
    res.json({ message: 'Data saved to Google Sheets successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
