const express=require('express');
const userRouter=express.Router();
const HomesController=require('../controller/store-controller');

console.log("Came to user ROuter");

//To user only show home page
userRouter.get("/",HomesController.getIndex);
userRouter.get("/home-list",HomesController.availableHomes);
userRouter.get("/booking/:homeId",HomesController.getBooking);
userRouter.post("/BookHome",HomesController.postBooking);
userRouter.get("/favorite",HomesController.getFavorite);
userRouter.post("/favorite",HomesController.postFavorite);
userRouter.get("/home-detail/:homeId",HomesController.getDetails);
userRouter.post("/delete-fav",HomesController.delete_fav);
userRouter.get("/store/rule/:homeId",HomesController.download);
userRouter.post("/user/booking",HomesController.userBooking);
userRouter.post("/booking/cancel/:bookingId",HomesController.cancelBooking);
//index is my first main page home for  the air bnb
//home-list is the available homes


//router--> to tell which url is to be handles passes on to the controller
//controller-> actual handling of code done by the controller


module.exports=userRouter;