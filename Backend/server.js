import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDb from './src/config/db.js'

connectDb();

app.listen(config.PORT, ()=>{
    console.log(`server is running on port ${config.PORT}`);
    
})