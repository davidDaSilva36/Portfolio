
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI= "mongodb+srv://dasilv_e:JS2rlYb9fJQA9GR2@cluster0.d8qviyf.mongodb.net/?retryWrites=true&w=majority"
app.use(express.json());
//password db JS2rlYb9fJQA9GR2
// Connect to MongoDB
mongoose.connect(MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
    console.log('Connected successfully to MongoDB');
});

// Use user routes
app.use('/users', userRoutes);

// Use product routes
app.use('/products', productRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

