
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Product = require('../models/productModel');

// Get the list of the products
const getAllProducts = async (req, res) => {
    try {
        
        const products_array = await Product.find();

        if(!products_array)
        {
            return res.status(400).json({message: 'No products were found'});
        }
        res.status(201).json({ products_array });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const createProduct = async (req, res) => {
    try {
        
        const { name, category, description, price } = req.body;

        // Check if the product already exist
        const product = await Product.findOne({ name });
        if (product) {
            return res.status(400).json({ message: 'product already exist' });
        }

        // Create the product
        const newProduct = await Product.create({ name, category, description, price });

        res.status(201).json({ product: newProduct, message: 'Product created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getProductById = async (req, res) => {
    try {
        
        const productId = req.params.id;
        const product = await Product.findById(productId);

        //check if product exists
        if(!product)
        {
            return res.status(404).json({message: 'Product not found'});
        }

        res.status(201).json({ product: product, message: 'Product found successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateProduct = async (req, res) => {
    try {
        
        const { name, category, description, price } = req.body;
        const productId = req.params.id;
        const product = await Product.findById(productId);

        //check if propduct exists
        if(!product)
        {
            return res.status(404).json({message: 'Product not found'});
        }

        // Update product information
        product.name = name || product.name;
        product.category = category || product.category;
        product.description = description || product.description;
        product.price = price || product.price;

        //Save the information in the database
        await product.save();

        res.status(201).json({ product: product, message: 'Product update successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findById(productId);

        //check if product exists
        if(!product)
        {
            return res.status(404).json({message: 'Product not found'});
        }

        //Delete the product
        await product.deleteOne();

        res.status(201).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
};
