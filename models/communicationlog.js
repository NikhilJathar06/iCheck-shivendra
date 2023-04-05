const mongoose = require('mongoose');

const Schema = mongoose.Schema; 
const communicationlogSchema = new Schema({
    email: {
      type: String,
      required: true
    },
    name: {
      type: String
    },
    companyName: {
      type: String
    },
    Chapter: {
      type: String,
      required: true
    },
    "Section Name": {
      type: String,
      required: true
    },
    "Question No": {
      type: String,
      required: true
    },
    chats: [
      {
        message: {
          type: String
        },
        timestamp: {
          type: Date,
          default: Date.now
        },
        role: {
          type: String
        },
      }
    ],
    isRead: {
      type: Boolean,
      default: false
    },
    checklistId: {
      type:String
    }
  });
  
  communicationlogSchema.index(
    { email: 1, Chapter: 1, "Section Name": 1, "Question No": 1 },
    { unique: true }
  );
  

module.exports = mongoose.model('Communicationlog', communicationlogSchema);