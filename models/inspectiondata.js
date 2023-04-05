const mongoose = require('mongoose');

const inspectionDataSchema = new mongoose.Schema({
  checkListName: {
    type: String,
    required: true
  },
  checkListID:{
    type:String
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
  },
  ISM: {
    type: String,
  },
  TMSA: {
    type: String,
  },
  Risk:{
    type:String
  },
  created_at:{
    type:Number, default:Date.now().valueOf()
},
updated_at:{
    type:Number, default:Date.now().valueOf()
}  
});

module.exports = mongoose.model('inspectionData', inspectionDataSchema);
