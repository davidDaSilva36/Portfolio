
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Create new user
const registerUser = async (req, res) => {
    try {
        
        const { username, password } = req.body;

        // Check if the username is already taken
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

       
        const newUser = await User.create({ username, password: hashedPassword });

        res.status(201).json({ user: newUser, message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Login
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            'your_secret_key', // Replace with a secure secret key
            { expiresIn: '2h' } // Token expiration time
        );

        
        user.token = token;
        await user.save();

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get the list of the users
const getAllUsers = async (req, res) => {
    try {
        
        const user_array = await User.find();
        
        res.status(201).json({ user_array });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//Get the detail of user by the id
const getUserbyId = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if(!user)
        {
            return res.status(404).json({message: 'User not found'});
        }

        res.status(201).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateUser = async (req, res) => {
    try {
        
        const userId = req.params.id;
        
        const { username, password  } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await User.findById(userId);

        //check if user exists
        if(!user)
        {
            return res.status(404).json({message: 'User not found'});
        }
        
        // Update user information
        user.username = username || user.username;
        user.password = hashedPassword || user.password;

        //Save the information in the database
        await user.save();

        res.status(201).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        //check if user exists
        if(!user)
        {
            return res.status(404).json({message: 'User not found'});
        }

        //Delete the user
        await user.deleteOne();

        res.status(201).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserbyId,
    updateUser,
    deleteUser,
};
