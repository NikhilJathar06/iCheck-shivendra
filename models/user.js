const mongoose = require('mongoose');

const Schema = mongoose.Schema;



const userSchema = new Schema({
    role:{
        type:String
    },
    name:{
        type:String
    },
    email:{
        type:String, unique: true
    },
    companyName:{
        type:String
    },
    phoneno:{
        type:String
    },
    password:{
        type:String, required: true
    },
    expiryDate: {
        type: Date,
        default: () => {
            const currentDate = new Date();
            currentDate.setFullYear(currentDate.getFullYear() + 1);
            return currentDate;
        }    },
    OTP: {
        type: String
    },
    OTPExpires: {
        type: Date
    },
    created_at:{
        type:Number, default:Date.now().valueOf()
    },
    updated_at:{
        type:Number, default:Date.now().valueOf()
    }   
});


module.exports = mongoose.model('User', userSchema);