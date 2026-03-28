const mongoose = require("mongoose");
const Home=require("./home")
const bookingSchema = new mongoose.Schema({
  
  home: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Home",
    required: true
  },
   user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        // checkOut must be after checkIn
        return this.checkIn < value;
      },
      message: "Check-out date must be after check-in date"
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending"
  }
});



const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;