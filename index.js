import express from 'express';
import  path  from 'path';
import  { config }  from 'dotenv';
config({path: path.resolve('./src/config/config.env')}); 

const app = express();
const port = process.env.PORT || 3001;

import { bootestrap } from './src/index.routers.js';
bootestrap(app,express)

app.listen(port ,()=>{console.log(`Example app is listening on port ${port}!`);});