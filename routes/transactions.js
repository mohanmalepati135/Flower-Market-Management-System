const express = require('express');
const router = express.Router();
const { 
  getTransactions, 
  createTransaction, 
  fixPrices, 
  getSettlement, 
  deleteTransaction, 
  undoDelete, 
  getStats 
} = require('../controllers/transactionController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, getTransactions);
router.post('/', auth, createTransaction);
router.post('/fix-prices/:farmerId', auth, adminOnly, fixPrices);
router.get('/settlement/:farmerId', auth, getSettlement);
router.delete('/:id', auth, deleteTransaction);
router.post('/undo-delete/:id', auth, undoDelete);
router.get('/stats/overview', auth, adminOnly, getStats);

module.exports = router;