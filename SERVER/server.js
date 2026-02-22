const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const cors = require("cors")
const fileUpload = require("express-fileupload")
require("dotenv").config()

//Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"https://studynotion-self-iota.vercel.app",
    credentials:true,
}))
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
)

//Database connection
const {dbConnect} = require("./config/database")
dbConnect()

//Cloudinary connection
const {cloudinaryConnect} = require("./config/cloudinary")
cloudinaryConnect()





//Mounting the routes
app.use("/api/v1/auth",require("./routes/User"))
app.use("/api/v1/profile",require("./routes/Profile"))
app.use("/api/v1/payment",require("./routes/Payments"))
app.use("/api/v1/course",require("./routes/Courses"))
app.use("/api/v1/contactus",require("./routes/Contact"))

//Default route
app.get("/", (req,res)=>{
    return res.json({
        message:"Server is working",
        success:true,
    })
})

//Starting the server
const PORT = process.env.PORT || 4000
app.listen(PORT, ()=>{
    console.log("Server started at port ",PORT)
})


