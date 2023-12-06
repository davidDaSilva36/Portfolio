const jwt = require('jsonwebtoken');
const isAdmin = (req, res, next) => {
    const token = req.headers['authorization'].split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access, missing token' });
    }
    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        req.user = decoded.user;
        if(decoded.role === 'ADMIN'){
            next();
        } else {
            return res.sendStatus(403);
        }
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = isAdmin;

