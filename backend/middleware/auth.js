const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
            if (err) return res.status(403).json({ success: false, error: 'forbidden', message: 'Invalid or expired token.' });
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ success: false, error: 'unauthorized', message: 'Authentication required.' });
    }
};

module.exports = {
    authenticateJWT
};
