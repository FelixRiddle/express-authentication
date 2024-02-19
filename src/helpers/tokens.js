const jwt = require("jsonwebtoken");

// Generate id
const generateId = () => {
    return Date.now().toString(32) + Math.random().toString(32).substring(2);
}

const generateJwtToken = (data) => {
    // Authenticate user
    const secretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(
        data,
        secretKey,
        {
            expiresIn: "7d"
        }
    );
    
    return token;
}

module.exports = {
    generateId,
    generateJwtToken,
};
