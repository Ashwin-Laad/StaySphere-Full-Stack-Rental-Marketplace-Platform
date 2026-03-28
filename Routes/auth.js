const express=require('express');
const authRouter=express.Router();
const authController=require('../controller/auth');

authRouter.get("/login",authController.login);
authRouter.post("/login",authController.postLogin)
authRouter.post("/logout",authController.logOut); //genrally all changing state effect should be as post not get/ else you directly come
authRouter.get("/signup",authController.getSignUp);
authRouter.post("/signup",authController.postSignUp);

// authRouter.post("/signup",authController.postSignUp);
module.exports=authRouter;