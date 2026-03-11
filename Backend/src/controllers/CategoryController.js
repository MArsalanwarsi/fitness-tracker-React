import categoryModel from "../models/categoryModel.js";

const addCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Name is required" });
        const category = await categoryModel.create({ name, userId });
        return res.status(201).json({ message: "Category added successfully", category });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getUserCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const category = await categoryModel.find({ userId });
        return res.status(200).json({ category });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Name is required" });
        const category = await categoryModel.findOneAndUpdate(
            { _id: id, userId },
            { name },
            { new: true }
        );
        if (!category) return res.status(404).json({ message: "Category not found" });
        return res.status(200).json({ message: "Category updated successfully", category });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const category = await categoryModel.findOneAndDelete({ _id: id, userId });
        if (!category) return res.status(404).json({ message: "Category not found" });
        return res.status(200).json({ message: "Category deleted successfully", categoryId: id });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export { addCategory, getUserCategory, updateCategory, deleteCategory };