import {comparePassword , hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import OrderModel from "../models/OrderModel.js";
import jwt from "jsonwebtoken";


export const registerController = async(req, res)=>{
    try{
        // destructuring jo user data rigistration mr de rha hai
         const {name,email,password,phone,address, answer }= req.body 

         // validations password
         if(!name){ return res.send({message :'Name is require'})};

         if(!email){ return res.send({message :'email is require & unique'})};

         if(!password){ return res.send({message :'Password is require'})};

         if(!phone){ return res.send({message :'Phone no. is require'})};

         if(!address){ return res.send({message :'Address is require'})};

         if(!answer){ return res.send({message :'Answer is require'})};

         //existing user
         const exisitingUser = await userModel.findOne({email});  

         if(exisitingUser){
            return res.status(200).send({
                success: false,
                message: 'Already Register Please login',
            })
         }
         
         //register user

          const hashedPassword = await hashPassword(password)

          //save , create new row i.e. model there store 
           const user = await new userModel({name, email, phone, address, password: hashedPassword, answer}).save()
         
           res.status(201).send({
            success: true,
            message: 'user Register successfully',
            user
           })
       }
    catch(error){
                // console.log(error)
                 res.status(500).send({
                    success: false,
                    message: "Error in Registration",
                    error
                 })
                }
};


//for LOGIN post function

export const loginController = async (req , res)=>{
   try{
         const {email , password}= req.body 
         // validation
         if(!email || !password)
         {
            return res.status(404).send({
                  success: false,
                  message: 'Invalid email or password'
            })
         }
         //check user hai ya nhi 
         const user = await userModel.findOne({email});
         if(!user)
         {
            return res.status(404).send({
                success: false,
                message:'Email is not registerd'
            })
         }
         const match = await comparePassword(password, user.password)
         if(!match)
         {
            return res.status(200).send({
                success: false,
                message:'Invalid Password'
            })
         }
      //token
      const token = /*await */ jwt.sign({ _id:user._id}, process.env.jwt_Secret, {expiresIn:"7d",});

      res.status(200).send({
        success:true,
        message:'login successfully',
        user:{
               name: user.name,
               email: user.email,
               phone: user.phone,
               address: user.address,
               role : user.role,
             },
        token
      })

      }
    catch(error){
                   // console.log(error);
                    res.status(500).send({
                                            success: false,
                                            message: 'Error in Login',
                                            error
                                         })
                }
};


// for password forgt
export const forgetPasswordontroller= async(req, res)=>{
      try{
            const {email, answer, newPassword} = req.body ;
            if(!email)
            {
               res.status(400).send({message:'Email is required'})
            }
            if(!answer)
            {
               res.status(400).send({message:'Answer is required'})
            }
            if(!newPassword)
            {
               res.status(400).send({message:'New Password is required'})
            }
          //check , jo user Email & password diya kya shi hai
          const user = await userModel.findOne({email, answer})

          // validation , 
          if(!user)
          {
            return res.status(404).send({
               success: false,
               message:'Wrong Emai or Answer'
            })
          }
         // new password ko hash kiye
          const hashed = await hashPassword(newPassword)

          // ab database me update kre
         await userModel.findByIdAndUpdate(user._id, {password:hashed})

         //updated password ko save 
         res.status(200).send({
            success: true,
            message:'Password Reset Successfully',
         });


         } 
      catch(error){
                   // console.log(error);
                    res.status(500).send({
                     success:false,
                     message: 'Something went wrong',
                     error
                    })
                  }  
}



//test controller

export const testController = (req, res)=>{
    res.send("Protected Route");
}


//export default {registerController };

//update user  profile
export const updateProfileController= async(req, res)=>{
try{
   const {name, email, password, address, phone} = req.body
   const user = await userModel.findById(req.user._id)
   //password
   if(password && password.length < 6)
   {
      return res.json({error:'Password is required and 6 character long'})
   }
   const hashedPassword = password ? await hashPassword(password) : undefined
   const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
      name: name || user.name,
      password: hashedPassword || user.password,
      email: email || user.email,
      address: address || user.address,
      phone: phone || user.phone,

   },{new:true})
   res.status(200).send({
      success:true,
      message:"Profile updated successfully",
      updatedUser,
   })
}
catch(error){
  // console.log(error)
   res.status(400).send({
      success: false,
      message:"error in updating user profile controller",
      error,
   }
      
    )}
 }

  // user order controller

 export const getOrdersController = async(req, res)=>{
     try{
           const orders = await OrderModel.find({buyer: req.user._id}).populate("products", "-photo").populate("buyer","name") 
           res.json(orders) 
     }
     catch(error){
         // console.log(error)
           res.status(400).send({
            success: false,
            message:"error in  user Order page ",
            error
           })
     }
  }

 // all order controller 
  export const getAllOrdersController = async(req, res)=>{
    try{
      const orders = await OrderModel.find({}).populate("products", "-photo").populate("buyer","name").sort({createdAt:"-1"})
      res.json(orders) 
    }
    catch(error){
     // console.log(error)
      res.status(400).send({
         success:false,
         message:"error in all order page controller in authController",
         error
      })
    }
  }

  export const orderStatusController=async(req, res)=>{
   try{
        const {orderId} = req.params
        const {status}= req.body
        const orders = await OrderModel.findByIdAndUpdate(orderId, {status}, {new: true})
        res.json(orders);
      }
   catch(error){
      //console.log(error)
      res.status(400).send({
         success:false,
         message:"error in order status page controller in authController",
         error
      })
   }
  }