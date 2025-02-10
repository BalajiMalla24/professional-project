import cors from "cors";
import cookieParser from "cookie-parser";
const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

//json body
app.use(express.json({limit:"16kb"}))

//data from url
app.use(express.urlencoded({
    limit:"16kb",
    extended:true
}))
//data file uploading
app.use(express.static("public"))



export default app