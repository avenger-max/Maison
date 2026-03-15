// backend/models/cartModel.js
const db = require('../config/db');

const CartModel = {
    getByUser: async (userId) => {
        const [rows] = await db.query(
            `SELECT c.id, c.quantity, c.product_id,
                    p.name, p.price, p.image, p.stock
             FROM cart c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = ?`,
            [userId]
        );
        return rows;
    },
    addItem: async (userId, productId, quantity) => {
        await db.query(
            `INSERT INTO cart (user_id, product_id, quantity)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
            [userId, productId, quantity, quantity]
        );
    },
    updateItem: async (cartId, userId, quantity) => {
        const [result] = await db.query(
            'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
            [quantity, cartId, userId]
        );
        return result.affectedRows;
    },
    removeItem: async (cartId, userId) => {
        const [result] = await db.query(
            'DELETE FROM cart WHERE id = ? AND user_id = ?',
            [cartId, userId]
        );
        return result.affectedRows;
    },
    clearCart: async (userId) => {
        await db.query('DELETE FROM cart WHERE user_id = ?', [userId]);
    }
};

module.exports = CartModel;
