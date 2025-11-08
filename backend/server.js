import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from './routes/authRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import candidateRoutes from './routes/candidateRoutes.js'
import path from "path";
import { fileURLToPath } from "url";


const app = express()
dotenv.config()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use('/auth',authRoutes)
app.use("/admin",adminRoutes)
app.use('/candidate',candidateRoutes)



app.listen(process.env.PORT,()=>{
    console.log("server running at port http://localhost:5000");  
})