import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import { sampleProducts } from "./sampleProducts.js"; // export sampleProducts from your front-end file

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log("MongoDB connected");
    await Product.deleteMany({}); // optional: clear old data
    const inserted = await Product.insertMany(sampleProducts);
    console.log("Data uploaded:", inserted.length);
    mongoose.disconnect();
})
.catch(err => console.error(err));
