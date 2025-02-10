import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectdb = async ()=>{
       try {
        const connectinstance  = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`db connection sucessfull ${connectinstance.connection.host}`)
        console.log(connectinstance.connection.host)
      //here connectinstance.connection.host gives you url
      //  which specifies which port are you connected with(production , server test)
       } catch (error) {
        console.log("error connecting to the db" , error)
        process.exit(1)
    }
}
export default connectdb