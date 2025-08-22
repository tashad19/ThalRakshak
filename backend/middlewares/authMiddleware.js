const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Hospital = require('../models/Hospital');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        
        // Verify user/hospital still exists based on type
        if (decoded.type === 'user') {
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }
        } else if (decoded.type === 'hospital') {
            const hospital = await Hospital.findById(decoded.id);
            if (!hospital) {
                return res.status(401).json({ message: 'Hospital not found' });
            }
        } else {
            return res.status(401).json({ message: 'Invalid user type' });
        }
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;