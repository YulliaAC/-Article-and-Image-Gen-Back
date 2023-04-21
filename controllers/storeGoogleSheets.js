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
  // try {
  const token = await authClient.authorize();
  authClient.setCredentials(token);

  const storedData = await servise.spreadsheets.values.get({
    auth: authClient,
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: "B2:AG",
  });


  console.log(storedData.data.values);
  // } catch (error) {
  // console.log(error.message);
  // }
  const answers = [];

  const rows = storedData.data.values;
  if (rows.length) {
    // rows.shift();
    console.log(rows);
    for (const row of rows) {
      answers.push({
        createWith: row[0],
        url: row[1],
        needOwnTitlesToRegener: row[2],
        needOwnTitlesWithourRegener: row[3],
        postingBackScrappedTitles: row[4],
        artQuantity: row[5],
        newTitlesConfirm: row[6],
        generatedArticles: row[7],
        newTitlesConfirm2: row[8],
        generatedArticles: row[9],
        generatedArticles3: row[10],
        imageGen: row[11],
        costomiseImagePrompts: row[12],
        imageGen2: row[13],
        imageGen3: row[14],
        saveToMongo: row[15],
        pushToGoogleDocs: row[16],
        recieveFromGogleDocs: row[17],
        pushToVercel: row[18],
        propmtsForGPTBlog: row[19],
        imageGenPrompts: row[20],
        artGenByGPTBlog: row[21],
        saveNewArtToMongo: row[22],
        next: row[23],
        save: row[24],
        imageGenPrompts2: row[20],
        url2: row[21],
        newTitles: row[22],
        newTitlesConfirm3: row[23],
        generatedArticles4: row[24],
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
