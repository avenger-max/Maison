// backend/controllers/cartController.js
const CartModel = require('../models/cartModel');
const ProductModel = require('../models/productModel');

const getCart = async (req, res) => {
    try {
        const items = await CartModel.getByUser(req.user.id);
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        res.json({ items, total: parseFloat(total.toFixed(2)) });
    } catch (err) {
        console.error('Get cart error:', err);
        res.status(500).json({ message: 'Failed to fetch cart.' });
    }
};

const addToCart = async (req, res) => {
    try {
        const { product_id, quantity = 1 } = req.body;
        if (!product_id) return res.status(400).json({ message: 'Product ID is required.' });

        const product = await ProductModel.findById(product_id);
        if (!product) return res.status(404).json({ message: 'Product not found.' });
        if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock.' });

        await CartModel.addItem(req.user.id, product_id, quantity);
        res.json({ message: 'Item added to cart.' });
    } catch (err) {
        console.error('Add to cart error:', err);
        res.status(500).json({ message: 'Failed to add item to cart.' });
    }
};

const updateCart = async (req, res) => {
    try {
        const { cart_id, quantity } = req.body;
        if (!cart_id || quantity === undefined)
            return res.status(400).json({ message: 'Cart ID and quantity are required.' });
        if (quantity < 1)
            return res.status(400).json({ message: 'Quantity must be at least 1.' });

        const affected = await CartModel.updateItem(cart_id, req.user.id, quantity);
        if (!affected) return res.status(404).json({ message: 'Cart item not found.' });
        res.json({ message: 'Cart updated.' });
    } catch (err) {
        console.error('Update cart error:', err);
        res.status(500).json({ message: 'Failed to update cart.' });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const affected = await CartModel.removeItem(req.params.id, req.user.id);
        if (!affected) return res.status(404).json({ message: 'Cart item not found.' });
        res.json({ message: 'Item removed from cart.' });
    } catch (err) {
        console.error('Remove cart error:', err);
        res.status(500).json({ message: 'Failed to remove item.' });
    }
};

module.exports = { getCart, addToCart, updateCart, removeFromCart };
