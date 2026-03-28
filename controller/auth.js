
const { check, validationResult } = require("express-validator");
const User=require("../Model/user");
const bcrypt=require("bcrypt");


exports.login=(req,res,next)=>{
  //render the login page
  res.render("auth/login",{
    title:"Login Page",
    isLogged:false,
    old_val:"",
    errors:[]
  })
};

exports.postLogin=async (req,res,next)=>{

  //get user info
  console.log(req.body.email, req.body.password);
  const password=req.body.password;
  const email=req.body.email;
  //check is user exits
  //.findOne returns null if not found
  const user=await User.findOne({email:email}); 
  console.log(user);//pauses function to get the value
  if(!user){
    //no user exits
    //return so code does not continue
    return res.render("auth/login",{
    title:"Login Page",
    isLogged:false,
    old_val:email,
    errors:["User not found"]
  })
  }

  //check for password user exists
  const hased_pass=user.hashedPassword;
  const match=await bcrypt.compare(password,hased_pass ); 
  if(!match){
    //diff password
     res.render("auth/login",{
    title:"Login Page",
    isLogged:false,
    old_val:email,
    error:["Password not correct"]
  })
  }
  //all goood
console.log("came here1");

req.session.isLogged = true;
req.session.user = {
  ...user.toObject(), //converts mongoose document to objects so remove all extra attributes and all
  _id: user._id.toString(),
    fav: user.fav.map(f => f.toString()) // <-- key change
};

await req.session.save(err => {
  if (err) {
    console.log("Session save failed:", err);
  } else {
    console.log("Session saved successfully");
    console.log(req.session.user);
    res.redirect("/");
  }
});


  //add the cookie to the browser
  // res.cookie("isLogged",true);

}

exports.logOut=(req,res,next)=>{
  console.log("Loggging out");
  // res.cookie("isLogged",false);

  //session obj still there on mongo but key removed and all null so even though cookie is stored having session id no use

  req.session.destroy(()=>{
    console.log("Session destroyed");
     res.redirect("/login");   
  })
 
  // cookie names should be unique if you want to store separate data. Reusing the same name just updates the old cookie.
}

exports.getSignUp=(req,res,next)=>{
  res.render("auth/signUp",{title:"SignUp", isLogged: req.isLogged, 
    errors:[],
    oldInput:{}
  });
}
exports.postSignUp = [
  //using express validator a sequence of middleware to check all sign up parameters

  check("firstName")
  .trim()
  .isLength({min: 2})
  .withMessage("First Name should be atleast 2 characters long")
  .matches(/^[A-Za-z\s]+$/)
  .withMessage("First Name should contain only alphabets"),

  check("lastName")
  .matches(/^[A-Za-z\s]*$/)
  .withMessage("Last Name should contain only alphabets"),

  check("email")
  .isEmail()
  .withMessage("Please enter a valid email")
  .normalizeEmail(),

  check("password")
  .isLength({min: 8})
  .withMessage("Password should be atleast 8 characters long")
  .matches(/[A-Z]/)
  .withMessage("Password should contain atleast one uppercase letter")
  .matches(/[a-z]/)
  .withMessage("Password should contain atleast one lowercase letter")
  .matches(/[0-9]/)
  .withMessage("Password should contain atleast one number")
  .matches(/[!@&]/)
  .withMessage("Password should contain atleast one special character")
  .trim(),

  check("confirmPassword")
  .trim()
  .custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

  check("role")
  .notEmpty()
  .withMessage("Please select a user type")
  .isIn(['guest', 'host'])
  .withMessage("Invalid user type"),

  check("terms")
  .notEmpty()
  .withMessage("Please accept the terms and conditions")
  .custom((value, {req}) => {
//     {
//   req,        // the full request object
//   location,   // where the value came from (body, query, params)
//   path        // field name (e.g., "terms")
// }
    if (value !== "on") {
      throw new Error("Please accept the terms and conditions");
    }
    return true;
  }),
  
  (req, res, next) => {
    const {firstName, lastName, email, password, role} = req.body;
    const errors = validationResult(req); 
    console.log(req.body);
    if (!errors.isEmpty()) {

      console.log(errors.array().map(err => err.msg));
      return res.status(422).render("auth/signup", {
        title: "Signup",
        isLogged: false,
        errors: errors.array().map(err => err.msg), //.array part of validator lib returns errors.errors
        oldInput: {firstName, lastName, email, password, role}, //will be sent again to user for filling again
      
      });


    }
    
// [
//   'Last Name should contain only alphabets',
//   'Please enter a valid email',
//   'Password should be atleast 8 characters long',
//   'Password should contain atleast one uppercase letter',
//   'Password should contain atleast one number',
//   'Password should contain atleast one special character',
//   'Passwords do not match',
//   'Please select a user type',
//   'Invalid user type'
// ] errors.array().map(err->err.msg)

//     //no errors redirect to login page
//save user to db

bcrypt.hash(password,10).then((hashedPassword)=>{
  const user=new User({firstName, lastName, email, hashedPassword, role});
  return user.save();
}).then((result)=>{
  console.log("User saved",result);
   res.redirect("/login");
}).catch(err=>{
  console.log(err);
  return res.status(422).render("auth/signup", {
        title: "Signup",
        isLogged: false,
        errors: [err.message], 
        oldInput: {firstName, lastName, email, password, role}, 
})})

  }
]
//   {
//   name: "Error",
//   message: "Something went wrong",
//   stack: "Error: Something went wrong\n    at ..."
// } err