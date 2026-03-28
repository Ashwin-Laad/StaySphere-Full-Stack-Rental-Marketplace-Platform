const rootDir=require('../utils/utils')
const express=require('express');
const hostRouter= express.Router();
const HomesController=require('../controller/host-controller');
const Home = require('../Model/home');
//or we can have named export {proper name} 

//here instead of using path and __dirname we directly used root dir and path module defined in utils

//create a constant global variable so to store all the listed houses
const RegisteredHouse=[];

hostRouter.get("/add-home",HomesController.get_add_home);

hostRouter.post("/add-home",HomesController.post_add_home);

hostRouter.get("/host-home-list",HomesController.getHostList);

hostRouter.get("/host/edit-home/:homeId",HomesController.getHostEdit);

hostRouter.post("/edit-home",HomesController.post_edit_home);

//:homeId tells the router that this is a variable path
hostRouter.post("/host/delete-home/:homeId",HomesController.delete_home);

//only exports one thing

module.exports={
  hostRouter:hostRouter,
  
}
