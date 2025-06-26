const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // 1. Get token from the request header
    const authHeader = req.header('Authorization');

    // 2. Check if token exists
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // 3. Verify the token
        // The header format is "Bearer <token>", so we split it and take the second part
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. If token is valid, attach the user's info to the request object
        req.user = decoded.user;
        next(); // Move on to the next function (our controller)
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;