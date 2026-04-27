import mongoose from 'mongoose'
import config from './config.js';

const connectDb = () => {
    try{
        mongoose.connect(config.MONGO_URI);
        console.log("connected successfully");
    }catch(err){
        console.log(err);
    }
}
export default connectDb;