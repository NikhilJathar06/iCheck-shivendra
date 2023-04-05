const mongoose = require('mongoose');

const testDataSchema = new mongoose.Schema({
  Chapter: {
    type: String,
    required: true
  },
  SectionName: {
    type: String,
    required: true
  },
  QuestionNo: {
    type: String,
  },
  QuestionDescription: {
    type: String,
  },
  InspectionGuidance: {
    type: String,
  },
  SuggestedInspectorActions: {
    type: String,
  },
  ExpectedEvidence: {
    type: String,
  },
  PotentialGroundsForANegativeObservation: {
    type: String,
  },
  ISM: {
    type: String,
  },
  TMSA: {
    type: String,
  }
});

module.exports = mongoose.model('testData', testDataSchema);
