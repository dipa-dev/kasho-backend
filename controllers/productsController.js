const product = require("../models/product");
const category = require("../models/category");

const getAllProducts = async (req, res) => {
    try {
        const products = await product.find({}).populate('category');
        return res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const singleProduct = await product.findById(id).populate('category');
        if (!singleProduct) {
            return res.status(404).json({ message: "No product found" });
        }
        return res.status(200).json({ singleProduct });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const addProduct = async (req, res) => {
    try {
        const singleProduct = req.body;
        const createdProduct = await product.create(singleProduct);
        res.status(201).json({ message: "Product added successfully.", data: createdProduct });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getCategory = async (req, res) => {
    try {
        const categories = await category.find({});
        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully", data: deletedProduct });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedProduct = await product.findByIdAndUpdate(id, updates, { new: true }).populate('category');
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product updated successfully", data: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getAllProducts,
    addProduct,
    getCategory,
    getProductById,
    deleteProduct,
    updateProduct
};
