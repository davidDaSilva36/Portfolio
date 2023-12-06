const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    description: {type: String, default: "None"},
    price: { type: Number, required: true },
    
});

const Product = mongoose.model('Product', userSchema);

module.exports = Product;