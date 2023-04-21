const fs = require("fs");
const { google } = require("googleapis");
require("dotenv").config();

const servise = google.sheets("v4");
const credentials = require("../credentials.json");

const authClient = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key.replace(/\\n/g, "\n"),
  ["https://www.googleapis.com/auth/spreadsheets"],
  
);

const storeGoogleSheets = async (req, res) => {
  const token = await authClient.authorize();
  authClient.setCredentials(token);

  const storedData = await servise.spreadsheets.values.get({
    auth: authClient,
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: "B2:H",
  });


  console.log(storedData.data.values);
  const answers = [];

  const rows = storedData.data.values;
  if (rows.length) {
    // rows.shift();
    console.log(rows);
    for (const row of rows) {
      answers.push({
        createWith: row[0],
        quantity: row[1],
        gptBlogPrompt: row[2],
        imagesGeneralPrompt: row[3],
        wayOfGeneration: row[4],
        url: row[5],
        topic: row[6],
      });
    }
  } else {
    console.log("No data found.");
  }
  
  res.status(200).json(answers);
};

module.exports = {
  storeGoogleSheets,
};
