const mongoose = require('mongoose');

const vesselInspectionData = new mongoose.Schema({
    vesselName: {
        type: String,
    },
    email: {
        type: String,
    },
    companyName: {
        type:String
    },
    dateOfInspection:{
        type: Date
    },
    placeOfInspection:{
        type: String
    },
    inspectornames:{
        type:[String]
    },
    checkListRemark:{
        type:String
    },
    checklistId:{
        type:String
    },
    checkListName:{
        type:String,
    },
    progress:{
        type:String
    },
    createdAt:{
        type: Number,
        default:Date.now().valueOf()
    },
    updated_at:{
        type:Number, default:Date.now().valueOf()
    },
    questions:[
        {
            questionNo: {
                type:String
            },
            checkListName:{
                type:String
            },
            "Question Description":{
                type:String
            },
            "Inspection Guidance":{
                type:String
            },
            "Suggested Inspector Actions":{
                type:String
            },
            "Expected Evidence":{
                type:String
            },
            "Potential grounds for a Negative Observation":{
                type:String
            },
            ISM:{
                type:String
            },
            TMSA:{
                type:String
            },
            Risk:{
                type:String
            }

        }
    ]
})

module.exports = mongoose.model('vesselInspectionData', vesselInspectionData);