const jwt = require('jsonwebtoken');

/**
 * @description Generate a secure JWT Token for User Session
 * @param {string} id - The MongoDB User ID
 * @returns {string} - Signed JWT Token
 */
const generateToken = (id) => {
    // jwt.sign(payload, secret, options)
    return jwt.sign(
        { id }, 
        process.env.JWT_SECRET, 
        { 
            expiresIn: '8h' // Token 8 ghante baad expire ho jayega (Enterprise Standard)
        }
    );
};

module.exports = generateToken;