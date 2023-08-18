
// All stuffs regarding connection for database 
const mongoose = require('mongoose')
require('dotenv').config();

const DB = process.env.MONGO_URL;
mongoose.connect(DB , {
    // useNewUrlParser : true,
    // useCreateIndex : true,
    // useUnifiedTopology : true
    // useFindAndModify : false
}).then(() =>{
    console.log('connected to database')
})
.catch((e)=>{
    console.log("Error" + e)
})