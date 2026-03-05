import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    userId:{
      type:String,
      require:true
   },
}, { timestamps: true });

export default mongoose.model("category", categorySchema);
