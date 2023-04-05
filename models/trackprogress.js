const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const trackprogress = new Schema({
    email: {
        type: String
    },
    checklistId: {
        type: String
    },
    Chapter: {
        type: String
    },
    "Section Name": {
        type: String
    },
    "Question No": {
        type: String
    },
    "Question Description": {
        type: String,
    },
    "Inspection Guidance": {
        type: String,
    },
    "Suggested Inspector Actions": {
        type: String,
    },
    "Expected Evidence": {
        type: String,
    },
    "Potential grounds for a Negative Observation": {
        type: String,
    }
})

module.exports = mongoose.model('trackprogress', trackprogress);