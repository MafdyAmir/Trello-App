import mongoose from "mongoose";
import  path  from 'path';
import  { config }  from 'dotenv';
config({path: path.resolve('./source/config/config.env')}); 

export const Connection = async() =>{
    return await mongoose.connect(`mongodb://localhost:27017/trello`).then(()=>{
        console.log('connection DB seccssed....');
    })
    .catch((err) =>{
        console.log('fail to connection DB!',err);
    })
}

// mongoose.set('strictQuery', true);

