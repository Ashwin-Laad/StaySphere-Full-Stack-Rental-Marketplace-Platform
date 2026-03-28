const express=require('express');
const userRouter=require("./Routes/user");
const {hostRouter}=require('./Routes/host');
const rootDir=require("./utils/utils")
const path=require('path')
const app=express();
const home=require('./controller/error');
const Home=require("./Model/home");
const authRouter=require("./Routes/auth");
const multer=require("multer");
// const RegisteredHomes=Home.fetchData();
require('dotenv').config();
const {connectDB,MONGO_URL}=require("./utils/database");
const session=require("express-session");
const MongodbStorage=require("connect-mongodb-session")(session);
const { error } = require('console');


const fileFilter = (req, file, cb) => {
  // Allowed mime types
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // accept file
  } else {
    cb(null, false); // reject file
  }
};

app.use(multer({dest:"uploads/"}).single("photo"));
app.use("/uploads", express.static(path.join(rootDir,'/uploads')));
app.use(express.static(path.join(rootDir,'public')));
//middleware to just print the url 
app.use((req,res,next)=>{
  console.log(req.url);
 
  //use next or code does not go forward
  next();
})
//make a store on db
const store=new MongodbStorage({
  uri:MONGO_URL,
  collection:"session"
});

app.use(session({
  secret:"mykey", //to check cookie tampering and signature,
  resave:false,
  saveUninitialized:true,
  store:store //stores and fetches sessions from  db
}))
//cookie check middle ware so to append on each request
app.use((req,res,next)=>{
  console.log("cookie middleware", req.session.isLogged);
  req.isLogged=req.session.isLogged; //if no session then assign undefned which later becomes false in next middleware, and then redirects to login page if session takes from storage(RAM,mongo) and adds the value
  // if you use the default in-memory store, sessions vanish on server restart.
  // if(req.get('cookie')){
  //   //cookie is present it may be false or true
  //   //string format
  //  if( req.get('cookie').split('=')[1]=='true') req.isLogged=true; //is checked later for each req in next middleware
  //  else req.isLogged=false;
  // }
  // else{
  //   console.log("no cookie");
  // }
  next();
})
//now middleware to redirect to login if not logged in
app.use((req,res,next)=>{

  const path_to_skip=["/login","/signup"];
  if(path_to_skip.includes(req.url)) return next(); //prevent infinite loop as runs for login req as well

  if(req.session.isLogged){
    //true
    console.log("Passed this");
    next();
  }
  else{
    res.redirect("/login");
    
  }
})
//all of this right before the .use middleware--> runs only on requests

//middleware to use ejs
app.set('view engine','ejs');
app.set('views','views');

//middleware to read the url
app.use(express.urlencoded({extended: true}));

//auth based routinr
app.use(authRouter);
//routing to user functions
console.log('passef ths')
app.use(userRouter);
// routing to host fucntions
app.use(hostRouter);

//if reached here means no response sent so invalid url so send 404

app.use(home.pageNotFound);



//export mongoclient which  takes in a callback
PORT=process.env.PORT || 3000;
connectDB().then(()=>{
  app.listen(PORT,(err)=>{
  if(err) console.log(err.message);
  console.log("Server running on port: "+ PORT );
})
}) //here callback client comes only when all succesful

