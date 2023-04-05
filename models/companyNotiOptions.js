const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const companyNotiOptions = new Schema({
    companyName: {
        type: String
    },
    email: {
        type: String
    },
    checklistCreated: [
        {
            isChecked: {
                type: Boolean
            },
            inAppNotifications: {
                type: Boolean,
            },
            emailNotifications: {
                type: Boolean,
            }
        }
    ],
    checklistSubmitted: [
        {
            isChecked: {
                type: Boolean
            },
            inAppNotifications: {
                type: Boolean,
            },
            emailNotifications: {
                type: Boolean,
            }
        }
    ],
    checklistCompleted: [
        {
            isChecked: {
                type: Boolean
            },
            inAppNotifications: {
                type: Boolean,
            },
            emailNotifications: {
                type: Boolean,
            }
        }
    ],
    newCommunication: [
        {
            isChecked: {
                type: Boolean
            },
            inAppNotifications: {
                type: Boolean,
            },
            emailNotifications: {
                type: Boolean,
            }
        }
    ],
    dueDate: [
        {
            isChecked: {
                type: Boolean
            },
            inAppNotifications: {
                type: Boolean,
            },
            emailNotifications: {
                type: Boolean,
            }
        }
    ],
    reminderDuration: [
        {
            isChecked: {
                type: Boolean
            },
            reminderDuration: {
                type: Number,
            }
        }
    ],
    questionsGenerated:[
        {
            noOfQuestions:{
                type:Number
            },
            highQuestions:{
                type:Number
            },
            mediumQuestions:{
                type:Number
            },
            lowQuestions:{
                type:Number
            }
        }
    ]
})

module.exports = mongoose.model('companyNotiOptions', companyNotiOptions);