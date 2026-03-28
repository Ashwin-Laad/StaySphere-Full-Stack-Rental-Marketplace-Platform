const mongoose=require("mongoose");


const homeSchema = mongoose.Schema({
  host:{
    type:String,
    required:true
  },
  houseName: {
    type: String,
    required: true
  },
  pricePerNight: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  photo: String,
  description: String,

});
// schema.pre("event", function(next) {
//   // code runs BEFORE event
//   next();
// });
// findByIdAndDelete cannot use as event has to be findOne --internally converted


module.exports = mongoose.model('Home', homeSchema);