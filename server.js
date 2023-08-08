import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import cors from "cors";
import CategoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from './routes/productRoutes.js'
import  Path  from "path";
import path from "path";
import {fileURLToPath} from 'url';


const app = express();



//configure dotenv
dotenv.config();
const PORT = process.env.PORT || 8000;

//configure Database
connectDB();

//esModule fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middelware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, './client/build')))

//routers
app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/category", CategoryRoutes)

app.use("/api/v1/product", productRoutes);


app.use('*',function(req, res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
})


app.listen(PORT, () => {
    console.log(`This page is open at port ${PORT}`.bgCyan.white);

})
