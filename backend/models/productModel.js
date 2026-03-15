// backend/models/productModel.js
const db = require('../config/db');

const ProductModel = {
    getAll: async ({ search, category } = {}) => {
        let query = 'SELECT * FROM products WHERE 1=1';
        const params = [];
        if (search) {
            query += ' AND (name LIKE ? OR description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }
        query += ' ORDER BY created_at DESC';
        const [rows] = await db.query(query, params);
        return rows;
    },
    findById: async (id) => {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    },
    decrementStock: async (productId, quantity) => {
        await db.query(
            'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
            [quantity, productId, quantity]
        );
    }
};

module.exports = ProductModel;
