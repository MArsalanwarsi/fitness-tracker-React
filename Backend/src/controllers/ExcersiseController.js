import excersiseModel from "../models/excersiseModel.js";

const AddExcersise = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, description, category, difficulty, equipment, excersiseImage, sets, reps, tags, exerciseId } = req.body;

        if (!name || !description || !category || !difficulty || !equipment || !excersiseImage || !sets || !reps || !tags || !exerciseId || !userId) {
            return res.status(400).json({ message: "Please Fill Out All Fields" });
        }

        const excersise = await excersiseModel.create({
            name,
            imageUrl: excersiseImage,
            category,
            difficulty,
            equipment,
            sets,
            reps,
            tags,
            instructions: description,
            userId,
            excersiseId: exerciseId,
        });

        return res.status(201).json({ message: "Exercise added successfully", excersise });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getUserExcersises = async (req, res) => {
    try {
        const userId = req.user.id;
        const excersises = await excersiseModel.find({ userId });
        return res.status(200).json({ excersises });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const updateExcersise = async (req, res) => {
    try {
        const userId = req.user.id;
        const excersiseId = req.params.id;
        const { name, description, category, difficulty, equipment, excersiseImage, sets, reps, tags } = req.body;

        const excersise = await excersiseModel.findOne({ _id: excersiseId, userId });
        if (!excersise) {
            return res.status(404).json({ message: "Exercise not found" });
        }

        if (name) excersise.name = name;
        if (description) excersise.instructions = description;
        if (category) excersise.category = category;
        if (difficulty) excersise.difficulty = difficulty;
        if (equipment) excersise.equipment = equipment;
        if (excersiseImage) excersise.imageUrl = excersiseImage;
        if (sets) excersise.sets = sets;
        if (reps) excersise.reps = reps;
        if (tags) excersise.tags = tags;

        await excersise.save();

        return res.status(200).json({ message: "Exercise updated successfully", excersise });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteExcersise = async (req, res) => {
    try {
        const userId = req.user.id;
        const excersiseId = req.params.id;

        const excersise = await excersiseModel.findOneAndDelete({ _id: excersiseId, userId });
        if (!excersise) {
            return res.status(404).json({ message: "Exercise not found" });
        }

        return res.status(200).json({ message: "Exercise deleted successfully", excersiseId });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export { AddExcersise, getUserExcersises, updateExcersise, deleteExcersise };