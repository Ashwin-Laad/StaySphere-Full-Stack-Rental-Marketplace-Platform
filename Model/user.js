const mongoose=require("mongoose");
const Homes=require("./home");

const homeSchema = mongoose.Schema({
  firstName:{
    type:String,
    required:true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },

  //now for each user we their favorite 
  //fav stores reference id to homes  we populate them when needed
  fav:[{type: mongoose.Schema.Types.ObjectId,
    ref:"Home"}
  ]
});

module.exports = mongoose.model('User', homeSchema);