const mongoose = require('mongoose');
const { Schema } = mongoose;

const TaskSchema = new Schema({
  title:          { type: String, required: true },
  description:    { type: String, required: true },
  status:         { type: String, enum: ['pending', 'in-progress', 'completed', 'needs_review', 'revision'], default: 'pending' },
  assignedTo:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assignedBy:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate:        { type: Date, required: true },
  submissionText: { type: String, default: '' },
  submissionNote: { type: String, default: '' },
  submissionFiles:[{ type: String }],
  submittedAt:    { type: Date },
  feedbackNote:   { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
