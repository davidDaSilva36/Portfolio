const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Define user routes
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/getallusers', auth, admin, UserController.getAllUsers);
router.get('/getuserbyid/:id', auth, admin, UserController.getUserbyId);
router.put('/updateuserbyid/:id', auth, admin, UserController.updateUser);
router.delete('/deleteuser/:id', auth, admin, UserController.deleteUser);
// Add more routes as needed

module.exports = router;
