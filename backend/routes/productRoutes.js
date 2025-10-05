const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET all products
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add new product
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Seed route: insert sample products
router.get("/seed", async (req, res) => {
  try {
    await Product.deleteMany(); // Clear old products
    const sampleProducts = [
  {
    "name": "Nike Running Shoes",
    "price": 4999,
    "category": "Footwear",
    "imageURL": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnCqenF1kXloWW0XkXgGmyIrvIrcLPFDygtg&s",
    "variants": [
      { "color": "Black", "size": "42", "stock": 10 },
      { "color": "White", "size": "40", "stock": 5 }
    ]
  },
  {
    "name": "iPhone 15",
    "price": 79999,
    "category": "Electronics",
    "imageURL": "https://m.media-amazon.com/images/I/71d7rfSl0wL.jpg",
    "variants": [
      { "color": "Black", "size": "128GB", "stock": 8 },
      { "color": "Blue", "size": "256GB", "stock": 4 }
    ]
  },
  {
    "name": "Men's T-Shirt",
    "price": 799,
    "category": "Clothing",
    "imageURL": "https://thehouseofrare.com/cdn/shop/files/mano-mens-t-shirt-white27624_12378c0a-13fe-4ae7-898c-97937bbc2aae.jpg?v=1719483708",
    "variants": [
      { "color": "Red", "size": "M", "stock": 15 },
      { "color": "Blue", "size": "L", "stock": 12 }
    ]
  }
]

;
    await Product.insertMany(sampleProducts);
    res.json({ message: "Sample products inserted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
