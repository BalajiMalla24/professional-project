import { asynchandler } from "../utils/asynchandler.js";
import { Apierror } from "../utils/Apierror.js";
import { User } from "../models/user.model.js";
import { uploadfile } from "../utils/Cloudinary.js";
import { apiresponse } from "../utils/apiresponse.js";
import jwt from 'jsonwebtoken'
const createaccessandrefreshtoken = async(userId)=>{
try {
  const user = await User.findById(userId)
  const accesstoken = user.generateAccesstoken()
  const refreshtoken = user.generateRefreshtoken()
  //saving refresh token in userdb schema

  user.refreshtoken = refreshtoken

 await user.save({
    validateBeforeSave : false,
  })
  return {accesstoken , refreshtoken}
} catch (error) {
  throw new Apierror(500 , "something went wrong error occurred while creaing access token and refresh token")
}
}

const registerUser = asynchandler(async (req, res) => {
  // await  res.status(200).json({
  //       message:"ok",
  //   })
  //getting data from users
  const { fullname, email, password, username } = req.body;

  //checking if the above fields are empty
  if ([fullname, email, password, username].some((field) => (
    field?.trim() === ""
  ))) {
    throw new Apierror(400, "please fill all the fields")
  }

  //check if user exists 
  const existingusers = await User.findOne({
    $or: [{ email }, { username }]
  })

  if (existingusers) {
    throw new Apierror(409, "User already exists")

  }

  const avatarlocalpath = req.files?.avatar[0]?.path;
  // const coverImagelocalpath = req.files?.coverImage[0]?.path;
  let coverImagelocalpath;
  if (
    req.files && Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImagelocalpath = req.files.coverImage[0].path
  }

  if (!avatarlocalpath) {
    throw new Apierror(400, "Avatar file is required")
  }

  const cloudavatar = await uploadfile(avatarlocalpath)
  const cloudcoverImage =  coverImagelocalpath ? await uploadfile(coverImagelocalpath) : {url: ""}

  if (!cloudavatar) {
    throw new Apierror(400, "Avatar file is required")
  }

  const user = await User.create({
    avatar: cloudavatar.url,
    coverImage: cloudcoverImage.url || "",
    email,
    username : username.toLowerCase(),
    password,
    fullname
  });

  //takes time
  const createdUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  )

  if (!createdUser) {
    throw new Apierror(500, "Internal server error") //creating an object
  }

  return res.status(201).json(
    new apiresponse(201, createdUser, "user sucessfully created")
  )
})

const loginUser = asynchandler(async (req , res)=>{
   //take data from req.body
   //check for username and email
   //check if user exists
   //validate password
   //if yes create access and refresh tokens
   //send cookies with server only modification
   //return response

   const {username , email , password} =req.body
    console.log(email)
   if(!(username || email)){
    throw new Apierror(400 , "please enter username or email to proceed")
   }

  
   const user  = await User.findOne({
        $or : [{email} , {username}]
      })

      if(!user){
        throw new Apierror(404 , "user does not exist")
      }
      
      const validpassword = await user.isPasswordCorrect(password)

      if(!validpassword){
       throw new Apierror(401 , "invalid user credentials")
      }
   
      //creating access and refreshtoken
    const {accesstoken , refreshtoken} = await createaccessandrefreshtoken(user._id)

      //calling user after updating refreshtoken field in db(optional) (circular references)
      const loggedinuser = User.findById(user._id).select(
        "-password , -refreshtoken"
      )
    //
      //set cookies server only modified
   
      const options = {
        httpOnly:true,
        secure :true
      }
 
      return res
      .status(200)
      .cookie("accesstoken" , accesstoken , options)
      .cookie("refreshtoken" , refreshtoken , options)
      .json(new apiresponse(200 , 
        {
          user :  accesstoken , refreshtoken //when user want to save data in local storage (mobile application)   
        },
        "User successfully logged in"
      )
    )
})

const logoutUser = asynchandler(async(req , res)=>{
// req.user
   
    User.findByIdAndUpdate(
      req.user._id , 
      {
        $set:{
          refreshtoken:undefined
        }
      },
      {
        new :true //??
      }
    )
    const options ={
      httpOnly:true,
      secure:true
    }
    return res.status(200)
    .clearCookie("accesstoken" , options)
    .clearCookie("refreshtoken" , options)
    .json(
      new apiresponse(200 , {} , "user successfully logged out")
    )
})

//creating endpoint
const refreshAccessToken = asynchandler( async(req , res , next)=>{

   const incomingrefreshtoken = req.cookies.refreshtoken || req.body.refreshtoken;

   if(!incomingrefreshtoken){
    throw new Apierror(401 , "no refresh token")
   }
   const decodedtoken = jwt.verify(incomingrefreshtoken , process.env.REFRESH_TOKEN_SECRET)

   const user = await User.findById(decodedtoken?._id)

   if(!user){
    throw new Apierror(401 , "no user with the given refresh token")
   }
   
   if(incomingrefreshtoken !== user?.refreshtoken){
    throw new Apierror(401 , "invalid refresh token")
   }
   const options = {
    httpOnly :true,
    secure:true
   }

   const {accesstoken , newrefreshtoken} =  await createaccessandrefreshtoken(user._id)

   res.status(200)
   .cookie("accesstoken" , accesstoken , options)
   .cookie("refreshtoken" , newrefreshtoken , options)
   .json(
    new Apierror(200 , {
      accesstoken , 
      refreshtoken : newrefreshtoken
    } , "access token refreshed successfully")
   )
})


export { registerUser  , loginUser , logoutUser , refreshAccessToken}