// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { createOrder, getOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
router.use(protect);
router.post('/create', createOrder);
router.get('/', getOrders);
module.exports = router;
