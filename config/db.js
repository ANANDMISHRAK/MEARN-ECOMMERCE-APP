 import mongoose from "mongoose";
 import color from "colors";
 const connectDB = async()=>{
    try{
         const conn = await mongoose.connect(process.env.MONGO_URL);
         console.log(`Connected To Mongo DB Database ${conn.connection.host}`.bgMagenta.white);
       }
    catch(error){
                  console.log(`Error in Mongodb Database ${error}`.bgRed.white);
                }
 };

 export default connectDB;