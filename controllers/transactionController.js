const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Flower = require('../models/Flower');

exports.getTransactions = async (req, res) => {
  try {
    const { farmer, buyer, involved } = req.query;
    let query = { isDeleted: false };
    
    if (farmer) query.farmer = farmer;
    if (buyer) {
      query.$or = [{ buyer }, { sellerBuyer: buyer }, { createdBy: buyer }];
    }
    if (involved) {
      query.$or = [
        { buyer: involved },
        { sellerBuyer: involved },
        { createdBy: involved },
        { farmer: involved }
      ];
    }
    
    const transactions = await Transaction.find(query)
      .populate('farmer', 'fullName phone preferredChannel')
      .populate('buyer', 'fullName phone preferredChannel')
      .populate('sellerBuyer', 'fullName phone preferredChannel')
      .sort({ createdAt: -1 });
      
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const txData = {
      ...req.body,
      createdBy: req.user.id
    };
    
    const transaction = new Transaction(txData);
    await transaction.save();
    
    const populatedTx = await Transaction.findById(transaction._id)
      .populate('farmer', 'fullName phone preferredChannel')
      .populate('buyer', 'fullName phone preferredChannel');
      
    res.status(201).json(populatedTx);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.fixPrices = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const commissionRate = 0.05;
    
    const flowers = await Flower.find();
    const flowerMap = {};
    flowers.forEach(f => flowerMap[f.name] = f.basePrice);
    
    const transactions = await Transaction.find({
      farmer: farmerId,
      status: 'PRICE_PENDING'
    });
    
    let fixed = 0;
    for (let tx of transactions) {
      const price = flowerMap[tx.flowerName];
      if (price && price > 0) {
        const gross = tx.weightKg * price;
        let commission = 0;
        
        if (tx.transactionType === 'BUYER_TO_BUYER') {
          commission = gross * commissionRate;
        }
        
        tx.pricePerKg = price;
        tx.grossAmount = gross;
        tx.commissionAmount = commission;
        tx.netAmount = gross - commission;
        tx.status = 'PRICE_APPLIED';
        
        await tx.save();
        fixed++;
      }
    }
    
    res.json({ fixed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSettlement = async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    const transactions = await Transaction.find({
      farmer: farmerId,
      isDeleted: false
    });
    
    const stats = {
      totalWeight: transactions.reduce((sum, t) => sum + t.weightKg, 0),
      gross: transactions.reduce((sum, t) => sum + (t.grossAmount || 0), 0),
      commission: transactions.reduce((sum, t) => sum + (t.commissionAmount || 0), 0),
      net: transactions.reduce((sum, t) => sum + (t.netAmount || 0), 0)
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    
    const created = new Date(tx.createdAt);
    const now = new Date();
    const diffDays = (now - created) / (1000 * 60 * 60 * 24);
    
    if (diffDays > 10) {
      return res.status(400).json({ message: 'Cannot delete after 10 days' });
    }
    
    tx.isDeleted = true;
    tx.deletedAt = new Date();
    await tx.save();
    
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.undoDelete = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx || !tx.deletedAt) {
      return res.status(404).json({ message: 'Transaction not found or not deleted' });
    }
    
    const deleted = new Date(tx.deletedAt);
    const now = new Date();
    const diffHours = (now - deleted) / (1000 * 60 * 60);
    
    if (diffHours > 24) {
      return res.status(400).json({ message: 'Undo period expired' });
    }
    
    tx.isDeleted = false;
    tx.deletedAt = null;
    await tx.save();
    
    res.json({ message: 'Transaction restored' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const transactions = await Transaction.find({ isDeleted: false });
    const users = await User.find();
    
    const stats = {
      totalWeight: transactions.reduce((sum, t) => sum + (t.weightKg || 0), 0),
      totalRevenue: transactions.reduce((sum, t) => sum + (t.netAmount || 0), 0),
      totalCommission: transactions.reduce((sum, t) => sum + (t.commissionAmount || 0), 0),
      pendingCount: transactions.filter(t => t.status === 'PRICE_PENDING').length,
      farmerCount: users.filter(u => u.role === 'FARMER').length
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};