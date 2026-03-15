// backend/controllers/orderController.js
const OrderModel = require('../models/orderModel');
const CartModel = require('../models/cartModel');
const ProductModel = require('../models/productModel');

const createOrder = async (req, res) => {
    try {
        const { address } = req.body;
        const userId = req.user.id;
        if (!address) return res.status(400).json({ message: 'Delivery address is required.' });

        const cartItems = await CartModel.getByUser(userId);
        if (!cartItems.length) return res.status(400).json({ message: 'Your cart is empty.' });

        let totalAmount = 0;
        for (const item of cartItems) {
            if (item.stock < item.quantity)
                return res.status(400).json({ message: `Insufficient stock for "${item.name}".` });
            totalAmount += item.price * item.quantity;
        }

        const orderId = await OrderModel.create(userId, totalAmount.toFixed(2), address);
        const orderItems = cartItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
        }));
        await OrderModel.addItems(orderId, orderItems);

        for (const item of cartItems) {
            await ProductModel.decrementStock(item.product_id, item.quantity);
        }

        await CartModel.clearCart(userId);
        res.status(201).json({ message: 'Order placed successfully.', orderId, total: parseFloat(totalAmount.toFixed(2)) });
    } catch (err) {
        console.error('Create order error:', err);
        res.status(500).json({ message: 'Failed to place order.' });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await OrderModel.getByUser(req.user.id);
        res.json({ orders });
    } catch (err) {
        console.error('Get orders error:', err);
        res.status(500).json({ message: 'Failed to fetch orders.' });
    }
};

module.exports = { createOrder, getOrders };
