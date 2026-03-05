import categoryModel from "../models/categoryModel.js";

const addCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name } = req.body;
        const category = await categoryModel.create({ name, userId });
       return res.status(201).json({ message: "Category added successfully", category });
    } catch (error) {
       return res.status(500).json({ error: error.message })
    }
}

const getUserCategory = async (req, res) => {
    try {
         const userId=req.user.id;
         const category= await categoryModel.find({ userId: userId });
         res.status(200).json({category})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export { addCategory, getUserCategory }