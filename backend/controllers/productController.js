const Product = require("../models/Product");

// Insert sample products
const seedProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    const products = await Product.insertMany([
      {
        name: "T-Shirt",
        price: 499,
        category: "Clothing",
        variants: [
          { color: "Red", size: "M", stock: 50 },
          { color: "Blue", size: "L", stock: 30 }
        ]
      },
      {
        name: "Sneakers",
        price: 1999,
        category: "Footwear",
        variants: [
          { color: "Black", size: "9", stock: 20 },
          { color: "White", size: "10", stock: 15 }
        ]
      },
      {
        name: "Laptop",
        price: 59999,
        category: "Electronics",
        variants: [
          { color: "Silver", size: "15-inch", stock: 10 },
          { color: "Gray", size: "14-inch", stock: 5 }
        ]
      }
    ]);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Filter by category
const getByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Project only variant details (color, size, stock)
const getVariants = async (req, res) => {
  try {
    const products = await Product.find({}, { name: 1, variants: 1, _id: 0 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { seedProducts, getProducts, getByCategory, getVariants };
