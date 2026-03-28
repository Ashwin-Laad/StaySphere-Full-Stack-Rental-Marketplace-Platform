const path = require("path");
const rootDir = require("../utils/utils");
const Home = require("../Model/home");

// const Stored_data = Home.fetchData();
//it is a static function so call wrt class

//for the host
//post_ home uses registered home array so create it here

exports.get_add_home = (req, res, next) => {
  // res.sendFile(path.join(rootDir,"views","host","add-home.html"));
  res.render("host/add-home",{isLogged:req.isLogged,role:req.session.user.role});
  
};

exports.post_add_home = (req, res, next) => {
  //no need for /
  // res.sendFile(path.join(rootDir,"views",'home.html'));
  const {
    host,
    houseName,
    pricePerNight,
    location,
    rating, 
    
    description,
  } = req.body;


  if(!req.file){
    console.log("Image not Proper");
    return res.redirect("/add-home");
  }
  photo=req.file.path;
    const home = new Home({
    host,
    houseName,
    pricePerNight,
    location,
    rating,
    photo,
    description}
  );
  home.save().then((result)=>{
    console.log("Inserted the data",result);
  });

  // console.log(Home.fetchData());
  // const Stored_data = Home.fetchData(); //a promise
  Home.find().then((RegisteredHouse) => { //array of object returned as [{},{}]
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

exports.getHostList = (req, res, next) => {
  const Stored_data = Home.find();
  Stored_data.then((RegisteredHouse) => {
    //here stored data returns a promise which is used to get the data from the database
    //once you get data render it as not defined outside

    console.log(RegisteredHouse);

    res.render("host/host-home-list", {
      RegisteredHouse: RegisteredHouse,
      title: "host home list Page",
      isLogged:req.isLogged,
      role:req.session.user.role
    });
  }).catch((error) => {
    console.log(error);
  });
};

exports.getHostEdit = (req, res, next) => {
  const id = req.params.homeId; //when host-home-list is rendered auto id from sql is added 
  const edit = req.query.edit;
  console.log(id, edit);

Home.findById(id).then((homes)=>{
  //homes has rows and structure we will only be getting one value
  //here home will be array of objects
  console.log(homes);
     if (!homes) {
      console.log("Home not there for editing");
      return res.redirect("/host-home-list");
    }

    //else home is there
    console.log(id, edit, homes);
    res.render("host/edit-home", { title:"edit-page",home: homes ,isLogged:req.isLogged,role:req.session.user.role});
  
})
}
exports.post_edit_home = (req, res, next) => {
 const { id, houseName, price, location, rating, description } =
    req.body;
  Home.findById(id).then((home) => {
    home.houseName = houseName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    // home.photo = photo;
    home.description = description;

    console.log(req.file);
    if(req.file){
      home.photo=req.file.path;
    }
    home.save().then((result) => {
      console.log("Home updated ", result);
    }).catch(err => {
      console.log("Error while updating ", err);
    })
    res.redirect("host-home-list");
  }).catch(err => {
    console.log("Error while finding home ", err);
  });
};

exports.delete_home = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log("Came to delete ", homeId);
  Home.findByIdAndDelete(homeId)
    .then(() => {
      res.redirect("/host-home-list");
    })
    .catch((error) => {
      console.log("Error while deleting ", error);
    });
};
// { _id: homeId }-- mongoose auto converts query to this