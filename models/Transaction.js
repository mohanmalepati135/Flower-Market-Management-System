const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionType: {
    type: String,
    enum: ['FARMER_TO_BUYER', 'BUYER_TO_BUYER'],
    required: true
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerBuyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  flowerName: {
    type: String,
    required: true
  },
  weightKg: {
    type: Number,
    required: true,
    min: 0
  },
  pricePerKg: {
    type: Number,
    default: 0
  },
  grossAmount: {
    type: Number,
    default: 0
  },
  commissionAmount: {
    type: Number,
    default: 0
  },
  netAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['PRICE_PENDING', 'PRICE_APPLIED'],
    default: 'PRICE_PENDING'
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);