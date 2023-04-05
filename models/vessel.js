const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const vesselSchema = new Schema({
    companyName: {
        type:String
    },
    vesselCode : {
        type: Number
    },
    vesselName : {
        type:String
    },
    vesselImo : {
        type: String,
    },
    vesselPostOfRegistry : {
        type:String
    },
    vesselCallSign : {
        type:String
    },
    vesselGrossTonage : {
        type:String
    },
    vesselSumerDeadweight : {
        type:String
    },
    vesselLengthOverall : {
        type:String
    },
    vesselBeam : {
        type:String
    },
    vesselDraught : {
        type:String
    },
    vesselYearOfBuilt:{
        type:String
    },
    vesselBuilderYard:{
        type:String
    },
    vesselPlaceOfBirth:{
        type:String
    },
    vesselClassificationSociety:{
        type:String
    },
    vesselMarineSuperintendent:{
        type:String
    },
    vesselTechnicalSuperintendent:{
        type:String
    },
    created_at:{
        type:Number, default:Date.now().valueOf()
    },
    updated_at:{
        type:Number, default:Date.now().valueOf()
    } 
})

module.exports = mongoose.model('Vessel', vesselSchema);