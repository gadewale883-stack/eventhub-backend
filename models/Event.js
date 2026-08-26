const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type:String,
    required:true
  },
  description: {
    type:String,
    required:true
  },
  venue:{
    type:String,
    required:true
  },
  eventDate:{
    type: Date,
    required: true
  },
  ticketPrice:{
    type: Number,
    required: true
  },
  availableSeats:{
    type: Number,
    required: true
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
},{
  timestamps:true
});

module.exports = mongoose.model("Event", eventSchema);