const mongoose = require('mongoose');

const Schema = mongoose.Schema; 

const notificationSchema = new Schema({
    companyName: {
        type:String
    },
    vesselName: {
        type: String
    },
    notificationType: {
        type: String
    },
    remainingDays:{
        type: String
    },
    isReadByCompany:{
        type: Boolean,
        default: false
    },
    questionNo:{
        type:String
    },
    checklistId:{
        type:String

    }

})


module.exports = mongoose.model('Notification', notificationSchema);