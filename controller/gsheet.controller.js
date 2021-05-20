import express from 'express';

const CONFIG = require('../config.json');

const GoogleSpreadsheet = require('google-spreadsheet');
const creds             = require('../client_secret.json');

const gSheetController = express.Router();


gSheetController.get('/fetchPhonesEV', function(req, res){
  
  // Identifying which document we'll be accessing/reading from
  var doc = new GoogleSpreadsheet(CONFIG.GSHEET_SPREADSHEET_V2_ID);

  // Authentication
  doc.useServiceAccountAuth(creds, function (err) {
  
    // Getting cells back from tab #2 of the file
    doc.getRows(1, callback); 

    // Callback function determining what to do with the information
    function callback(err, rows){
      
      // Logging the output or error, depending on how the request went
      console.log(rows)
      console.log(err)

      // Filtering only the values with "enviar = si".
      const to = rows.filter(contact => contact.enviar === "si");

      // Delete uneccessary key from the json object and rename accordingly as I need
      to.forEach(function(v){ 
        v['name'] = v['nombrecompleto'];
        v['nickname'] = v['apododeconfianza'];
        v['phone'] = v['celular'];
        v['role'] = v['rol'];
        v['age'] = v['grupoedad'];
        v['sex'] = v['sexo'];
        v['send'] = v['enviar'];
        
        delete v['nombrecompleto'];
        delete v['apododeconfianza'];
        delete v['celular'];
        delete v['rol'];
        delete v['grupoedad'];
        delete v['sexo'];
        delete v['enviar'];
        delete v['app:edited'];
        delete v._xml; 
        delete v.id; 
        delete v._links; 
      });

      res.send(to);

    }
    if(err){ 
      res.send(error)
    }
  });  
});
  


export default gSheetController;