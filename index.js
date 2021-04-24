require('dotenv').config()
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

import { gSheetController } from './controller' 

const basicAuth = require('express-basic-auth')


const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(basicAuth({
  users: { 'admin': process.env.SENDER_EMAIL_PSSWD },
  challenge: true,
  // realm: 'foo',
}))
// API
app.use(gSheetController);

function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

// eslint-disable-next-line
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  res.status(status);
  res.json({
    status,
    error: err.message,
  });
}

app.use(notFound);
app.use(errorHandler);

const  gSheetExtractorApi = process.env.GSHEET_API_PORT || 3006;

app.listen(gSheetExtractorApi, () => {
  console.log(`Started successfully server at port ${gSheetExtractorApi}`);
  
});
