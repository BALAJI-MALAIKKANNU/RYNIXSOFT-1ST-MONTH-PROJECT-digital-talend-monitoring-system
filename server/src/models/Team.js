const mongoose = require('mongoose');
const { Schema } = mongoose;

const TeamSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  limit: { type: Number, default: 50 },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);
