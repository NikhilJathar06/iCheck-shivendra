// const jwt = require('jsonwebtoken');
// module.exports = (req, res, next) => {
//     try{
//         const token = req.headers.authorization.split(' ')[1];
//     // return res.json(token);
//     const decode = jwt.verify(token, "webBatch")
//     req.userData = decode

//     next();
//     // return res.json(decode);
//     }
//     catch(error){
//         res.json({success:false, message:"Auth Failed!"})
//     }
// }

const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, "webBatch");
        req.userData = decoded;

        // Fetch the user from the database to get the expiry date
        const user = await User.findById(decoded.userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Check if the expiry date has passed
        const now = new Date();
        if (now > user.expiryDate) {
            throw new Error('Token has expired');
        }

        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Auth Failed!" });
    }
};
