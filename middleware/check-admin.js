const User = require('../models/user');

module.exports = async (req,res,next) => {
   try{
    const user = await User.findOne({ email:req.body.email });
    if(!user){
        return res.status(404).send({ message: "User not found" });
    }
    if(user.role != 'admin'){
        return res.status(401).send({ message: "Access Denied, You must be an admin" });
    }
    req.user = user;
    next();
   }
   catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
}