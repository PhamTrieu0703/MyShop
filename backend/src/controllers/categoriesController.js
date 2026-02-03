import categoriesModel from "../models/categoriesModel.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await categoriesModel.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoriesModel.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addCategory = async (req, res) => {
    const { name } = req.body;
    try {
        const newCategory = new categoriesModel({ name });
        await newCategory.save();
        res.status(201).json({ message: "Category added successfully", category: newCategory });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
};

export const deleteCategory = async (req, res) => {
    const { id } = req.params;  
    try {
        const deletedCategory = await categoriesModel.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const updatedCategory = await categoriesModel.findByIdAndUpdate(
            id,
            { name },
            { new: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }   
        res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}