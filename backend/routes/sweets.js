const express = require('express');
const sweetController = require('../controllers/sweetController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/sweets - View all sweets (protected)
router.get('/', authenticateToken, sweetController.getAllSweets);

// GET /api/sweets/search - Search sweets (protected)
router.get('/search', authenticateToken, sweetController.searchSweets);

// GET /api/sweets/:id - Get sweet by ID (protected)
router.get('/:id', authenticateToken, sweetController.getSweetById);

// POST /api/sweets - Add new sweet (protected, admin only)
router.post('/', authenticateToken, requireAdmin, sweetController.createSweet);

// PUT /api/sweets/:id - Update sweet (protected, admin only)
router.put('/:id', authenticateToken, requireAdmin, sweetController.updateSweet);

// DELETE /api/sweets/:id - Delete sweet (protected, admin only)
router.delete('/:id', authenticateToken, requireAdmin, sweetController.deleteSweet);

// POST /api/sweets/:id/purchase - Purchase sweet (protected)
router.post('/:id/purchase', authenticateToken, sweetController.purchaseSweet);

// POST /api/sweets/:id/restock - Restock sweet (protected, admin only)
router.post('/:id/restock', authenticateToken, requireAdmin, sweetController.restockSweet);

module.exports = router;

