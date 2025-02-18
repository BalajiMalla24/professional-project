import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

//json body
app.use(express.json({limit:"16kb"}))
app.use(cookieParser())
//data from url
app.use(express.urlencoded({
    limit:"16kb",
    extended:true
}))
//data file uploading
app.use(express.static("public"))

//routes import
import { userRoutes } from "./routes/register.routes.js";
app.use("/api/v1/users" , userRoutes)
export {app}