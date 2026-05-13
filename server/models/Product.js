const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  category: [{
    type: String,
    required: [true, 'Please add at least one category'],
    enum: ['Quran pak', 'Quran sets', 'Prayer Mats', 'Tasbeehat', 'Gift hampers', 'Bridal set', 'Nikkah sets', 'Surahs', 'Quran Ghilaf'],
  }],
  images: [
    {
      type: String,
      required: true,
    },
  ],
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  isBestSeller: {
    type: Boolean,
    default: false,
  },
  priceOnlyBoxRegular: { type: Number },
  priceOnlyBoxMedium: { type: Number },
  priceCompleteRegular: { type: Number },
  priceCompleteMedium: { type: Number },
  regularPrice: {
    type: Number,
  },
  mediumPrice: {
    type: Number,
  },
  onlyBoxPrice: {
    type: Number,
  },
  completePrice: {
    type: Number,
  },
  regularSizeSurcharge: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);
