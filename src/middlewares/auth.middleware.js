import jwt from 'jsonwebtoken';
import { Apierror } from '../utils/Apierror.js';
import { User } from '../models/user.model.js';
import { asynchandler } from '../utils/asynchandler.js';
export const jwtUserverify = asynchandler(async(req , res , next) =>{
   try {
    const token = req.cookies?.accesstoken  || req.header("Authorization")?.replace("Bearer " , "")
   //verification through header
   //to get refresh token without cookies like in mobile apps user req.body.refreshtoken
    if(!token){
       throw new Apierror("401" , "unauthorized request" )
    }
    const decodedtoken =   jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
   
       const user = await User.findById(decodedtoken?._id).select("-password -refreshtoken")
       if(!user){
       throw new Apierror(401 , "Invalid user access token ")

    }
    req.user = user
    next()
   } catch (error) {
    throw new Apierror(401 , error.message ||"invalid user")
   }
})