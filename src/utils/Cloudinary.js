import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});
const uploadfile = async (filepath) =>{
     try {
        if(!filepath) return null
        //upload file to cloudinary
      const response = await cloudinary.uploader.upload(filepath , {
            resource_type : "auto"
        })
      //   console.log("file uploaded to cloudinary" , response.url)
      fs.unlinkSync(filepath)
        return response
      
     } catch (error) {
        //if upload operation failed then unlink the file
        fs.unlinkSync(filepath)
        return null
     }
}
export {uploadfile}





// const uploadfile = async (filepath)=>{
//    try {
//      const response =  await cloudinary.uploader.upload(filepath)
//      console.log("file is uploaded" , )
//    } catch (error) {
//       fs.unlinkSync(filepath)
//    }
// }