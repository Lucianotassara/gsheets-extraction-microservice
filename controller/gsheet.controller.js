import express from 'express';

const CONFIG = require('../config.json');

const GoogleSpreadsheet = require('google-spreadsheet');
const creds             = require('../client_secret.json');

const gSheetController = express.Router();


// gSheetController.get('/fetchPhonesEV', function(req, res){
  
//   // Identifying which document we'll be accessing/reading from
//   var doc = new GoogleSpreadsheet(CONFIG.GSHEET_SPREADSHEET_V2_ID);

//   // Authentication
//   doc.useServiceAccountAuth(creds, function (err) {
  
//     // Getting cells back from tab #2 of the file
//     doc.getRows(1, callback); 

//     // Callback function determining what to do with the information
//     function callback(err, rows){
      
//       // Logging the output or error, depending on how the request went
//       console.log(rows)
//       console.log(err)

//       // Filtering only the values with "enviar = si".
//       const to = rows.filter(contact => contact.enviar === "si");

//       // Delete uneccessary key from the json object and rename accordingly as I need
//       to.forEach(function(v){ 
//         v['name'] = v['nombrecompleto'];
//         v['nickname'] = v['apododeconfianza'];
//         v['phone'] = v['celular'];
//         v['role'] = v['rol'];
//         v['age'] = v['grupoedad'];
//         v['sex'] = v['sexo'];
//         v['send'] = v['enviar'];
        
//         delete v['nombrecompleto'];
//         delete v['apododeconfianza'];
//         delete v['celular'];
//         delete v['rol'];
//         delete v['grupoedad'];
//         delete v['sexo'];
//         delete v['enviar'];
//         delete v['app:edited'];
//         delete v._xml; 
//         delete v.id; 
//         delete v._links; 
//       });

//       res.send(to);

//     }
//     if(err){ 
//       res.send(error)
//     }
//   });  
// });

gSheetController.get('/fetchPhonesEV', async function(req, res){
  const { GoogleSpreadsheet } = require('google-spreadsheet');

  // Initialize the sheet - doc ID is the long id in the sheets URL
  const doc = new GoogleSpreadsheet(CONFIG.GSHEET_SPREADSHEET_V2_ID);

  // Initialize Auth 
  await doc.useServiceAccountAuth({
    client_email: CONFIG.GSHEET_CLIENT_EMAIL,
    private_key: CONFIG.GSHEET_PRIVATE_KEY,
  });

  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  const rows = await sheet.getRows();

  let to = []
  rows.forEach(function(row, index) {
    if (row.Enviar==="si"){
      let contact = {
        "name":row.Nombre || "",
        "nickname":row.Apodo || "",
        "phone":row.Celular || "",
        "role":row.Rol || "",
        "age":row.Grupo || "",
        "sex":row.Sexo || "",
        "send":row.Enviar || ""
      }
      console.log(contact);
      to.push(contact);
    }  
  });


  res.json(to);

})
  


export default gSheetController;