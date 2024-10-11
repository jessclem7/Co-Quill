const jwt = require('jsonwebtoken');

// Middleware to protect routes
module.exports.protect = (roles = []) => {
    return (req, res, next) => {
        const token = req.header('Authorization').replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded.user;

            // Check if role is allowed
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Permission denied' });
            }

            next();
        } catch (err) {
            console.error(err.message);
            res.status(401).json({ message: 'Token is not valid' });
        }
    };
};
