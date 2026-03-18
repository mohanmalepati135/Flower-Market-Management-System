const express = require('express');
const router = express.Router();
const { getFlowers, createFlower, updateFlower, deleteFlower, applyPrice } = require('../controllers/flowerController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, getFlowers);
router.post('/', auth, adminOnly, createFlower);
router.patch('/:id', auth, adminOnly, updateFlower);
router.delete('/:id', auth, adminOnly, deleteFlower);
router.post('/apply-price', auth, adminOnly, applyPrice);

module.exports = router;