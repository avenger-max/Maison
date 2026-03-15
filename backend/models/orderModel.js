// backend/models/orderModel.js
const db = require('../config/db');

const OrderModel = {
    create: async (userId, totalAmount, address) => {
        const [result] = await db.query(
            'INSERT INTO orders (user_id, total_amount, address) VALUES (?, ?, ?)',
            [userId, totalAmount, address]
        );
        return result.insertId;
    },
    addItems: async (orderId, items) => {
        const values = items.map(item => [orderId, item.product_id, item.quantity, item.price]);
        await db.query(
            'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?',
            [values]
        );
    },
    getByUser: async (userId) => {
        const [rows] = await db.query(
            `SELECT o.id, o.total_amount, o.address, o.status, o.created_at,
                    oi.quantity, oi.price,
                    p.name as product_name, p.image
             FROM orders o
             JOIN order_items oi ON o.id = oi.order_id
             JOIN products p ON oi.product_id = p.id
             WHERE o.user_id = ?
             ORDER BY o.created_at DESC`,
            [userId]
        );
        return rows;
    }
};

module.exports = OrderModel;
