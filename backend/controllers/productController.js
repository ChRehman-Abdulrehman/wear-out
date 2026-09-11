const Product = require('../models/Product');
const { uploadToCloudinary } = require('../middleware/upload');

exports.getProducts = async (req, res) => {
  try {
    const { category, featured, search, gender, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (gender) filter.gender = gender;
    if (search) {
      const re = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: re }, { description: re }, { category: re }];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, sizes, category, inStock, stock, featured, rating, gender } = req.body;
    let parsedSizes = sizes;
    if (typeof sizes === 'string') {
      parsedSizes = sizes.split(',').map((s) => s.trim()).filter(Boolean);
    }

    let imageUrl = '';
    let images = [];
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(req.files.map((f) => uploadToCloudinary(f)));
      images = uploads.map((r) => r.secure_url);
      imageUrl = images[0] || '';
    } else if (req.file) {
      const result = await uploadToCloudinary(req.file);
      imageUrl = result.secure_url;
      images = [imageUrl];
    }

    const stockNum = stock !== undefined ? Number(stock) : 0;

    const product = new Product({
      name,
      description,
      price: Number(price),
      sizes: parsedSizes && parsedSizes.length ? parsedSizes : ['S', 'M', 'L', 'XL'],
      category,
      image: imageUrl,
      images,
      inStock: stockNum > 0 ? true : (inStock === 'false' || inStock === false ? false : true),
      stock: stockNum,
      featured: featured === 'true' || featured === true,
      rating: rating !== undefined ? Number(rating) : 0,
      gender: gender || 'Unisex',
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const { name, description, price, sizes, category, inStock, stock, featured, rating, gender } = req.body;
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category;
    if (rating !== undefined) product.rating = Number(rating);
    if (gender !== undefined) product.gender = gender;
    if (stock !== undefined) {
      product.stock = Number(stock);
      product.inStock = product.stock > 0;
    }
    if (sizes !== undefined) {
      let parsed = sizes;
      if (typeof sizes === 'string') parsed = sizes.split(',').map((s) => s.trim()).filter(Boolean);
      if (parsed.length) product.sizes = parsed;
    }
    if (inStock !== undefined && stock === undefined) product.inStock = inStock === 'false' || inStock === false ? false : true;
    if (featured !== undefined) product.featured = featured === 'true' || featured === true;
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(req.files.map((f) => uploadToCloudinary(f)));
      const newImages = uploads.map((r) => r.secure_url);
      product.images = [...(product.images || []), ...newImages];
      if (!product.image && product.images.length) product.image = product.images[0];
    } else if (req.file) {
      const result = await uploadToCloudinary(req.file);
      product.image = result.secure_url;
      if (!product.images || product.images.length === 0) product.images = [result.secure_url];
    }
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product removed', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).sort({ createdAt: -1 }).limit(20);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
