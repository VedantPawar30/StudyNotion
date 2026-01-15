const mongoose = require("mongoose")
require("dotenv").config()
exports.dbConnect = () =>{
    mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Database Connected successfully"))
    .catch( (error)=> {
        console.log("Error in Connecting to db")
        console.error(error)
        process.exit(1)
    })
}