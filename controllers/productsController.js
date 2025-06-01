const product = require("../models/product");
const category = require("../models/category");
const cloudinary = require('../config/cloudinary');

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
        let imageUrl = "";
        let imagePublicId = "";

        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'products'
            });
            imageUrl = uploadResult.secure_url;
            imagePublicId = uploadResult.public_id;
        }

        const newProduct = await product.create({
            ...req.body,
            imageUrl,
            imagePublicId
        });

        res.status(201).json({ message: "Product added successfully.", data: newProduct });
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
        const productToDelete = await product.findById(id);

        if (!productToDelete) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Delete image from Cloudinary if exists
        if (productToDelete.imagePublicId) {
            await cloudinary.uploader.destroy(productToDelete.imagePublicId);
        }

        await product.findByIdAndDelete(id);

        res.status(200).json({ message: "Product deleted successfully", data: productToDelete });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const existingProduct = await product.findById(id);

        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        let imageUrl = existingProduct.imageUrl;
        let imagePublicId = existingProduct.imagePublicId;

        if (req.file) {
            // Delete old image
            if (imagePublicId) {
                await cloudinary.uploader.destroy(imagePublicId);
            }

            // Upload new image
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'products'
            });
            imageUrl = uploadResult.secure_url;
            imagePublicId = uploadResult.public_id;
        }

        const updatedProduct = await product.findByIdAndUpdate(id, {
            ...req.body,
            imageUrl,
            imagePublicId
        }, { new: true }).populate('category');

        res.status(200).json({ message: "Product updated successfully", data: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const addCategory = async (req, res) => {
 const {name} = req.body;
 if(!name){
    return res.status(400).json({ message: "Please provide category" })
 }
 const createdCategory = await category.create({name});
 res.status(201).json("Category added successfully.")
}

module.exports = {
    getAllProducts,
    addProduct,
    getCategory,
    getProductById,
    deleteProduct,
    updateProduct,
    addCategory
};
