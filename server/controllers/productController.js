const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, images, stock, isBestSeller, priceOnlyBoxRegular, priceOnlyBoxMedium, priceCompleteRegular, priceCompleteMedium, regularPrice, mediumPrice } = req.body;

    const product = new Product({
      name,
      price,
      description,
      user: req.user._id,
      images,
      category,
      stock,
      isBestSeller: isBestSeller || false,
      priceOnlyBoxRegular,
      priceOnlyBoxMedium,
      priceCompleteRegular,
      priceCompleteMedium,
      regularPrice,
      mediumPrice,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(400).json({ message: error.message || 'Invalid product data' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, images, stock, isBestSeller, priceOnlyBoxRegular, priceOnlyBoxMedium, priceCompleteRegular, priceCompleteMedium, regularPrice, mediumPrice } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.category = category || product.category;
      product.images = images || product.images;
      product.stock = stock || product.stock;
      if (isBestSeller !== undefined) {
        product.isBestSeller = isBestSeller;
      }
      product.priceOnlyBoxRegular = priceOnlyBoxRegular !== undefined ? priceOnlyBoxRegular : product.priceOnlyBoxRegular;
      product.priceOnlyBoxMedium = priceOnlyBoxMedium !== undefined ? priceOnlyBoxMedium : product.priceOnlyBoxMedium;
      product.priceCompleteRegular = priceCompleteRegular !== undefined ? priceCompleteRegular : product.priceCompleteRegular;
      product.priceCompleteMedium = priceCompleteMedium !== undefined ? priceCompleteMedium : product.priceCompleteMedium;
      product.regularPrice = regularPrice !== undefined ? regularPrice : product.regularPrice;
      product.mediumPrice = mediumPrice !== undefined ? mediumPrice : product.mediumPrice;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(400).json({ message: error.message || 'Invalid product data' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
