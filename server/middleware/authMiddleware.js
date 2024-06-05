const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            next();
        } catch (error) {
            console.error('Token verification failed:', error.message);
            res.status(401).json({ message: "Not authorized, token failed"});
        }
    } else {
        console.error('No token provided');
        res.status(401).json({ message: "No token, authorization denied"});
    }
}

// Middleware untuk memeriksa role admin
const adminCheck = (req, res, next) => {
    // Setelah autentikasi, middleware authMiddleware akan menyimpan data user di req. user
    // lalu periksa role dari data tersebut

    if (req.user && req.user.role === 'admin') {
        next(); // User adalah admin, lanjutkan ke next middleware atau route handler
    } else {
        res.status(403).json({ message: "Akses ditolak: hanya role admin yang diperbolehkan"});
    }
};

module.exports = { authMiddleware, adminCheck };