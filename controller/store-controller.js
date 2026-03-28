
const Home = require("../Model/home");
const User=require("../Model/user");
const mongoose=require("mongoose");
const {ObjectId}=require("mongoose");
const path=require("path");
const RootDir=require("../utils/utils");
const Booking = require("../Model/booking");
const home = require("../Model/home");


// const RegisteredHouse=Home.fetchData();
//it is a static function so call wrt class
// const Stored_data=Home.fetchData();// has to updated everytime the function is called

//for the user
//home page
exports.getIndex = (req, res, next) => {

    res.render("store/index", 
    {title:"Home Page"});

};

exports.availableHomes = (req, res, next) => {
  const Stored_data = Home.find();
  Stored_data.then((RegisteredHouse) => {
    //here stored data returns a promise which is used to get the data from the database
    //once you get data render it as not defined outside

    console.log(RegisteredHouse);
    res.render("store/home-list", {
      RegisteredHouse: RegisteredHouse,
      title: "Home Page",
      isLogged:req.isLogged,
      role:req.session.user.role
    });
  }).catch((error) => {
    console.log(error);
  });
};

exports.getBooking = async(req, res, next) => {
//check if the house is booked or not
// const homeId=new mongoose.Types.ObjectId(req.params.id);
// const isBooked=Home.findById(homeId).then((result)=>{
//   if(result){

//     return result.booked;
//   }
// })
// const BookedHouse=Booking.findOne({home:homeId}).populate("home");
// //house is booked show the file for the next booking date
// if(isBooked){
// //print next checkout date
// let check_out_date=BookedHouse.checkOut;
// //display to user
// }
// //house not booked calculate the price and confirm user and assign user to that house
// else{
// //display the house to user 
// const House_obj=BookedHouse.home; //due to populate should have the actual object 
// let price=req.params.price;
//  let timeDifference = BookedHouse.checkOut - BookedHouse.checkIn;
//   let daysDifference = timeDifference / (1000 * 3600 * 24);
//   let totalPrice=daysDifference* price;

//   //now display this to user and confirm booking
// }



  console.log('Came in Booking');
  try {
    const homeId = req.params.homeId;
    console.log("Home id is",homeId);
    const home = await Home.findById(homeId);
    console.log(home);
    if (!home) {
          console.log("Came here",homeId);
      return res.status(404).json({ message: "Home not found" });
    }

    // Check if house is booked (any future booking overlapping today)
    const bookedHouse = await Booking.findOne({
      home: homeId,
      checkOut: { $gte: new Date() }, // bookings not yet finished
    }).sort({ checkOut: 1 }); // get the soonest checkout

    if (bookedHouse) {
      // House is booked, show next available checkout date
      return res.render("Booking/Booked",{
        message: "House is currently booked",
        nextAvailableDate: bookedHouse.checkOut,
      });
    } 
    else{
      console.log("Home there for booking");
      res.render("Booking/bookHome",{ title: "BookHome Page",
        home:home

      })
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.postBooking=async (req,res,next)=>{


  const homeId=new mongoose.Types.ObjectId(req.body.homeId);
  const userId=new mongoose.Types.ObjectId(req.session.user._id);
   // House not booked, calculate price for new booking
      const checkIn = new Date(req.body.checkIn);
      const checkOut = new Date(req.body.checkOut);

      if (checkOut <= checkIn) {
        return res.status(400).json({ message: "Check-out must be after check-in" });
      }

      const timeDiff = checkOut - checkIn; // in ms
      const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      const totalPrice = days * req.body.price; // assuming Home has price field

      // Create the booking (optional, if you want to confirm now)
      const booking = new Booking({
     
        home: homeId,
        user:userId,
        totalPrice,
        checkIn,
        checkOut,
        status: "confirmed",
      });
      const home=await Home.findOne({_id:homeId});

     console.log(home);

     booking.save().then((result)=>{
      console.log(result);
      
      res.render("Booking/Confirmed",{
        title:"Confirmed Booking",
        booking:result,
        home:home,
        checkIn:checkIn,
        checkOut:checkOut,
        totalPrice:totalPrice
      })
     }).catch(err=>{
      console.log(err);
     });



}
exports.userBooking = async (req, res, next) => {
  try {
    const userId=new mongoose.Types.ObjectId(req.session.user._id);
const bookings = await Booking.find({ user: userId }).populate("home");

console.log("Here are the bookings", bookings);
if(bookings.length==0) {
    res.render('Booking/UserBooking', {
      title: "My Bookings",
      booking:bookings
    });}
    else{
        res.render('Booking/UserBooking', {
      title: "My Bookings",
      booking:bookings[0]
    });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching bookings");
  }
};
exports.getFavorite = async (req, res, next) => {
  //task - the fav json just has the id merge it with the actual content and send it for rendering
  // as fav and home are related we can use Favrotie.find().populate("homeID")--> it auto matches the house id with homes as we have home stored as relation in favorites

  // Home.find().then(RegisteredHouse=>{
  //     Favorite.find().then(favorite=>{

  //   //favorite is ids stored in mongo db as array of objects i just want the field
  //   const ids=favorite.map(fav=> fav.homeId.toString()) //from mongoose schema
  //   console.log(ids);
  //   //now get the array
  //   //ids is basically the array of all the fav id
  //   //map iterate over id one by one and for each id again go through the registered house array and find the macth and return the content
  //   console.log(RegisteredHouse);
  //   const fav_content = ids   //_id object and tostring converts it into string
  //     .map((homeId) => RegisteredHouse.find((h) => homeId == h._id.toString()))
  //     .filter(Boolean);
  //   //.filter helps remove undefined value only true values are kept in the array

  //   console.log(fav_content);
  //   res.render("store/favorite", {
  //     RegisteredHouse: fav_content,
  //     title: "Favorite Page",
  //     isLogged:req.isLogged  //add in all as req can come from any url
  //   });

  //   //the here (ids) is a callback whose task is to give the array
  // })
  // }).catch(error=> console.log(error));;
  

  //from user we have to get the fav array of objects
  const user= req.session.user; //diff from actual document
  console.log(user);
  const userId=new mongoose.Types.ObjectId(user._id);
const userDoc = await User.findById(userId); // returns a document

// make sure fav are ObjectIds
userDoc.fav = userDoc.fav.map(c => new mongoose.Types.ObjectId(c));

console.log("this is fav look",userDoc);
await userDoc.populate("fav"); // populate fav field
 // populated fav
 


const fav_content = userDoc.fav;
console.log(fav_content);
     res.render("store/favorite", {
      RegisteredHouse: fav_content,
      title: "Favorite Page",
      isLogged:req.isLogged ,
      role:req.session.user.role //add in all as req can come from any url
    })

  
    //the here (ids) is a callback whose task is to give the array
  

  
  

  

}


exports.postFavorite = async (req, res, next) => {
  //document creation
  // const fav=new Favorite({homeId:req.body.id}); //here i have to specify homeId: and not id directly as not in schema directly 
  // if (Promise) // always truthy
  // if(Favorite.find({homeId:req.body.id})){ 
   //console.log("Home already included Came here");
  //   res.redirect("/favorite");
  // }
//find return [] or[ doc, doc2..] always true findOne return null or array
  // Favorite.findOne({homeId:req.body.id}).then((result)=>{
  //   if(result){
  //   console.log("Home already included Came here");
  //   res.redirect("/favorite");
  //   }
  //   else{
  //       fav.save().then((result)=>{
  //   console.log("Result saved",result);
  //   res.redirect("/favorite");
  // }).catch(error=>{
  //   console.log("fav not added",error);
  //    res.redirect("/favorite");
  // })
  //   }
  // })

  const id=req.body.id; //string
  console.log(id);
  const obj_id=new mongoose.Types.ObjectId(id);
  const userId=req.session.user._id;
   //have to await or gives query parameter as well
  const user_obj=new mongoose.Types.ObjectId(userId);
  const user=await User.findById(user_obj);
  // console.log(user);
  //check if home already exits 
  // user.fav.forEach((favId)=>{
  //   if(obj_id.equals(favId)){
  //     //already exists in fav
  //   console.log("Home already included Came here");
  //   return res.redirect("/favorite");

  //   }
  // })
  if (user.fav.some(favId => obj_id.equals(favId))) {
    console.log("Home already included");
    return res.redirect("/favorite"); // now this stops the outer function
}
  //if not add it
  
  user.fav.push(obj_id);
  req.session.user.fav.push(obj_id.toString());
  await req.session.save();
  //session collection also changed not used directly but for consistency
  user.save().then((result)=>{
    console.log("saved",result);
    res.redirect("/favorite");
  }).catch(err=>{
    console.log("not saved ",err);
  })



};
exports.getDetails = (req, res, next) => {
  //any data from the url is req.params and what ever you set :homeID
  const id = req.params.homeId;
  console.log("Your id is ", id);
  //now get the specific home
  //step-1 find the home by id
  // Home.findById(id, (home) => {
  //   console.log("Your home is" + home);
  //   //if home was not found redirect to home
  //   if (home === undefined) {
  //     res.render("store/index", {
  //       RegisteredHouse: RegisteredHouse,
  //       title: "Home details Page",
  //     });
  Home.findById(id).then((home)=>{
    console.log("Your home is:" ,home);
    const path=home.photo.split("\\").pop();
    home.photo=path;
        res.render("store/home-detail", {
        element: home,
        title: "Home details Page",
        isLogged:req.isLogged,
        role:req.session.user.role
      });
  }).catch(error=>{
    console.log(error);
     console.log("Home not found");
  })
     
    
    //now once you get the home only then render it

};

exports.delete_fav =async (req, res, next) => {
  //remove the fav from the file
  const id=req.body.id; //getting as name id
//or we can use findOneAndDelete
  // Favorite.deleteOne({homeId:id}).then(result=>{
  //   console.log("Home deletd",result);
  //  res.redirect("/home-list");
  // }).catch(error=>{
  //     console.log("Error deleting",error);
  //      res.redirect("/home-list");
  //   })
   const obj_id=new mongoose.Types.ObjectId(id);
  const userId=req.session.user._id;
   const user_obj=new mongoose.Types.ObjectId(userId);
  const user=await User.findById(user_obj);
  // console.log(user);
  //check if home already exits 
 const newFav= user.fav.filter((favId)=>{
  return !favId.equals(obj_id);
  })
  user.fav=newFav;
   const newFav1= req.session.user.fav.filter((favId)=>{
  return favId!=id;
  })

req.session.user.fav=newFav1;

  user.save().then((result)=>{
    console.log("Fav deleted", result);
    res.redirect("/favorite");
  }).catch((error)=>{
    console.log("Not deleted",err);
  })


};

exports.download=[
  (req,res,next)=>{
    if(req.isLogged){
      next();
    }
    else{
      res.redirect("/login");
    }
  },
  (req,res,next)=>{
    //now get the file from result folder and send to user
    const id=req.params.homeId;
    const filePath=path.join(RootDir,"public","HOUSE RULES.pdf");
    res.download(filePath,"HouseRules.pdf"); //instead of original name


}]

exports.cancelBooking=(req,res,next)=>{
  const bookId=new mongoose.Types.ObjectId(req.params.bookingId);
  Booking.findByIdAndDelete(bookId).then((result)=>{
    console.log("This is result ", result);
    if(!result){
      console.log("No record found");
      
    }
    else{
      console.log("Booking Cancelled");
      
    }
    res.redirect("/home-list");
  }).catch(err=>{
    console.log("Deleting error",err);
  })


}