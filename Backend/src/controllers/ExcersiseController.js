import excersiseModel from "../models/excersiseModel.js";

const AddExcersise=async(req,res)=>{
    try {
    const userId=req.user.id;
    const {name,description,category,difficulty,equipment,excersiseImage,sets,reps,tags,exerciseId}=req.body;
    if(!name || !description || !category || !difficulty || !equipment || !excersiseImage || !sets || !reps || !tags || !exerciseId || !userId){
        return res.status(404).json({message:"Please Fill Out All Fields"});
    }
    const excersise= await excersiseModel.create({
        name:name,
        imageUrl:excersiseImage,
        category:category,
        difficulty:difficulty,
        equipment:equipment,
        sets:sets,
        reps:reps,
        tags:tags,
        instructions:description,
        userId:userId,
        excersiseId:exerciseId
    });

return res.status(200).json({ message:`Exercise added successfully`,excersise});

} catch (error) {

return res.status(500).json({ error: error.message });      

}
}

const getUserExcersises=async(req,res)=>{
    try {
        const userId = req.user.id;
        const excersises = await excersiseModel.find({ userId: userId });
        return res.status(200).json({ excersises });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
const deleteExcersise = async (req, res) => {
    try {
        const userId = req.user.id;
        const excersiseId = req.params.id;
        const excersise = await excersiseModel.findOneAndDelete({ userId: userId, _id: excersiseId });
        if (!excersise) {
            return res.status(404).json({ message: "Exercise not found" });
        }
        return res.status(200).json({ message: "Exercise deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}




export {AddExcersise,getUserExcersises,deleteExcersise}