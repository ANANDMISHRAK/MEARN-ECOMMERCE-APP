import express from "express";
import {registerController, 
        loginController,
        forgetPasswordontroller, 
        testController,
        updateProfileController,
        getOrdersController,
        getAllOrdersController,
        orderStatusController} from "../controller/authController.js";

import { requireSignIn , isAdmin  } from "../middlewares/authMiddleware.js";


//router object
const router = express.Router()

//routing
// routing for Register using POST METHOD
router.post("/register",registerController);

// routing for LOGIN usinf POST METHOD
router.post("/login", loginController);

// Forget password || POST
 router.post("/forgot-password", forgetPasswordontroller);


// test routs
router.get('/test', requireSignIn , isAdmin, testController);

//protected route auth for user
router.get("/user-auth", requireSignIn, (req, res)=>{
        res.status(200).send({ok: true});
});


//protected route auth for admin
router.get("/admin-auth", requireSignIn, isAdmin, (req, res)=>{
        res.status(200).send({ok: true});
});

//Update user profile
router.put('/profile',requireSignIn, updateProfileController)

// user order rout
router.get('/orders', requireSignIn, getOrdersController);

//all order rout use in Admin order page
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController);

//order status change by Admin
router.put('/order-status/:orderId',requireSignIn, isAdmin, orderStatusController)

export default router