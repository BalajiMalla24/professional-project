import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const UserSchema = new Schema({
username:{
        type:String,
        unique:true,
        lowercase:true,
        trim :true,
        required:true

},
email:{
       type:String,
        unique:true,
        lowercase:true,
        trim :true,
        required:true,
        index:true

},
avatar:{
    type:String,
    required:true
},
coverImage:{
    type:String
},
fullname:{
    type:String,
    required:true,
    trim:true,
    lowercase:true
},
watchhistory:[
    {
        type:Schema.Types.ObjectId,
        ref:"video"
    }
],
password:{
    type:String,
    required:[true , "password required"]
},
refreshtoken:{
    type:String
}



} , {timestamps:true})

UserSchema.pre("save" , async function(next){
    if(!this.isModified("password")) return next()

    this.password = bcrypt.hash(this.password , 10)
   next()
})
//desiging custom methods through mongoose
UserSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare (password , this.password)
}
UserSchema.methods.generateAccesstoken = function(){
    return jwt.sign({
        _id : this._id,
        username:this.username,
        email:this.email,
        fullname :this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
UserSchema.methods.generateRefreshtoken = function(){
    return jwt.sign(
        {
            _id :this._id    //more data isn't required because this token keeps changing
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User", UserSchema)

