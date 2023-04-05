const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rectificationSchema = new Schema({
    companyName: {
        type:String
    },
    reasponseFindings: {
        type: String
    },
    reasponseActionTaken: {
        type: String
    },
    reasponseCorrectiveAction: {
        type: String
    },
    reasponseRootCauses: {
        type: String
    },
    reasponsePreventiveAction: {
        type: String
    },
    reasponseDateOfCompletion: {
        type: String
    },
    questionNo: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    checklistId:{
        type: String
    },
    modified_at:{
        type:Number, default:Date.now().valueOf()
    },
    ObservationValue:{
        type:String
    },
    attachmentDetails:  [
        {
            data:{
                type: []
            },
            fileName:{
                type:String
            },
            fileSize:{
                type:String
            }

        }
    ]
});

module.exports = mongoose.model('rectification', rectificationSchema);
