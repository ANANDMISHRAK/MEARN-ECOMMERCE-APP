import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

//protected Routes token base

export const requireSignIn =(req, res , next)=>{
try{
      const decode = jwt.verify(req.headers.authorization, process.env.jwt_Secret);
      req.user =decode;
      next()
   }
catch(error){
              // console.log(error);
            }

};


// admin accesss

export const isAdmin=async (req, res, next)=>{
    try{
          const user = await userModel.findById(req.user._id)
          if(user.role !== 1)
          {
            return res.status(401).send({
                success: false,
                message: 'UnAuthorized Access'
            })
          }
          else{
                 next();
              }
       }
    catch(error){
       // console.log(error);
        res.status(401).send({
            success: false,
            error,
            message: " error in admin middleware"
        })
    }
}