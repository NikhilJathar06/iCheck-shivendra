const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userProgressSchema = new Schema({
    nameOfVessel:{
        type:String
    },
    email:{
        type:String
    },
    checklistId:{
        type:String
    },
    Chapter:{
        type:String
    },
    "Section Name":{
        type:String
    },
    "Question No":{
        type:String
    },
    checkedValue:{
        type:String
    },
    Remarks:{
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
    ],
    communicationLog:{
        type:String
    }

})

module.exports = mongoose.model('UserProgress', userProgressSchema);