import mongoose from "mongoose";
// import express from "express";
// import { DB_NAME } from "./constants.js";
import connectdb from "./db/index.js";
import dotenv from "dotenv";
const app = express();
dotenv.config({
    path:'./env'
})
connectdb()
.then(
    app.listen(process.env.PORT || 8000 , (req,res)=>{
       res.send(`server listening at port:${process.env.PORT}`)
    }),
    app.on("error" , (error)=>{
        console.log("Err:" , error);
        throw error;
    })
)
.catch((error)=>{
    console.log("Failed connecting to the database" , error)
})



// (async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         //if express app has any error listen
//         app.on((error)=>{
//             console.log("Err:" , error);
//             throw error
//         })
//         app.listen(process.env.PORT , ()=>{
//             console.log(`server listening on port:${process.env.PORT}`)
//         })
//     } catch (error) {
//         console.log("Error connecting to the database:" , error)
//         process.exit(1)
//     }
// })()
