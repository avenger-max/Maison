// backend/models/userModel.js
const db = require('../config/db');

const UserModel = {
    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },
    findById: async (id) => {
        const [rows] = await db.query('SELECT id, name, email, created_at FROM users WHERE id = ?', [id]);
        return rows[0];
    },
    create: async ({ name, email, hashedPassword }) => {
        const [result] = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        return result.insertId;
    }
};

module.exports = UserModel;
