import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDb from './src/config/db.js'

connectDb();

app.listen(config.PORT || 5000, ()=>{
    console.log(`server is running on port ${config.PORT}`);
    
})