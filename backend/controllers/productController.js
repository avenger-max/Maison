// backend/controllers/productController.js
const ProductModel = require('../models/productModel');

const getProducts = async (req, res) => {
    try {
        const { search, category } = req.query;
        const products = await ProductModel.getAll({ search, category });
        res.json({ products });
    } catch (err) {
        console.error('Get products error:', err);
        res.status(500).json({ message: 'Failed to fetch products.' });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found.' });
        res.json({ product });
    } catch (err) {
        console.error('Get product error:', err);
        res.status(500).json({ message: 'Failed to fetch product.' });
    }
};

module.exports = { getProducts, getProductById };
