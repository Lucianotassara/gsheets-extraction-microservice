
import express from 'express';

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const { Console } = require('console');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = '../token.json';

const gSheetController = express.Router();

/**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
 function authorize(credentials, callback) {
  const {client_secret, client_id, javascript_origins} = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, javascript_origins[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}



// gSheetController.route('/').get(
//   (req, res) => {
//     // (req.params.code) ? '' : ''
//     res.redirect(`https://lucianotassara.com.ar/${params}`)
//   }
// );



gSheetController.get('/fetchPhonesEV', function(req, res){

  //check headers HERE to see if user is sending the secret
  

  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), listPhones);

  });

  /**
   * Prints the selected data from a specific spreadsheet:
   * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
   */
  function listPhones(auth) {
    const sheets = google.sheets({version: 'v4', auth});
    sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GSHEET_SPREADSHEET_ID,
      range: process.env.GSHEET_RANGE,
    }, (err, newRes) => {
      if (err) return console.log('The API returned an error: ' + err);
      const rows = newRes.data.values;

      if (rows.length) {
          const keys = ['name', 'nickname', 'phone', 'role', 'age', 'sex', 'send']; 
          const objects = rows.map(array => {
            const object = {};
            keys.forEach((key, i) => object[key] = array[i]);
            return object;
          });
          
          // Only filtering those with value "si" on spreadsheet E Column
          const to = objects.filter(contact => contact.send === "si");

          res.status(200).json(to);  
      } else {
          console.log('No data found.');
      }
    });
  }
  
});

  
export default gSheetController;