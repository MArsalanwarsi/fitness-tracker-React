import mongoose from "mongoose";

const excersiseModel = new mongoose.Schema({
   name:{
    type:String,
    require:true
   },
   imageUrl:{
    type:String,
    require:true
   },
   category:{
    type:String,
    require:true
   },
   difficulty:{
    type:String,
    require:true
   },
   equipment:{
    type:String,
    require:true
   },
   sets:{
    type:Number,
    require:true
   },
   reps:{
    type:Number,
    require:true
   },
   tags:[{
    type:String,
    require:true
   }],
   instructions:{
    type:String,
    require:true
   },
   userId:{
      type:String,
      require:true
   },
   excersiseId:{
      type:String,
      require:true
   }
}, { timestamps: true });

export default mongoose.model("excersise", excersiseModel);