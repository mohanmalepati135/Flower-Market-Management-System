const Flower = require('../models/Flower');
const Transaction = require('../models/Transaction');

exports.getFlowers = async (req, res) => {
  try {
    const flowers = await Flower.find();
    res.json(flowers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createFlower = async (req, res) => {
  try {
    const { name, basePrice } = req.body;
    const flower = new Flower({ name, basePrice: basePrice || 0 });
    await flower.save();
    res.status(201).json(flower);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateFlower = async (req, res) => {
  try {
    const { basePrice } = req.body;
    const flower = await Flower.findByIdAndUpdate(
      req.params.id,
      { basePrice },
      { new: true }
    );
    res.json(flower);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteFlower = async (req, res) => {
  try {
    await Flower.findByIdAndDelete(req.params.id);
    res.json({ message: 'Flower deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.applyPrice = async (req, res) => {
  try {
    const { flowerName, price } = req.body;
    const commissionRate = 0.05;
    
    await Flower.findOneAndUpdate({ name: flowerName }, { basePrice: price });
    
    const transactions = await Transaction.find({ 
      flowerName, 
      status: 'PRICE_PENDING' 
    });
    
    let updated = 0;
    for (let tx of transactions) {
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
      updated++;
    }
    
    res.json({ fixed: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};