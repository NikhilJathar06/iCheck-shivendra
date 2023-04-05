const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const companySchema = new Schema({
    companyCode: {
        type: Number
    },
    companyName : {
        type:String
    },
    companyAddress1 : {
        type: String,
    },
    companyAddress2 : {
        type:String
    },
    country: {
        type:String
    },
    state: {
        type:String
    },
    city:{
        type:String
    },
    companyPostalCode:{
        type:String
    },
    companyPersonInCharge : {
        type:String
    },
    picemails : {
        type:[String]
    },
    companyAccountHead : {
        type:String
    },
    companyAccountTel : {
        type:String
    },
    accEmails : {
        type:[String]
    },
    lastNotificationDate: {
        type:Date
    },
    companyStartDate : {
        type:Date
    },
    companySubscriptionRate : {
        type: String
    },
    companyDuration:{
        type: String
    },
    companyNoOfShips:{
        type:String
    },
    companyEndDate:{    
        type:Date
    },
    companySubscriptionCurrency:{
        type:String
    },
    isEnabled:{
        type:Boolean,
        default: true

    },
    created_at:{
        type:Number, default:Date.now().valueOf()
    },
    updated_at:{
        type:Number, default:Date.now().valueOf()
    } 
})

module.exports = mongoose.model('Company', companySchema);