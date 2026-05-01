const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: { type: String, required: true, unique: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String },
  rollNo: { type: String },
  admissionNo: { type: String },
  course: { type: String, required: true },
  institution: { type: String, required: true },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  issueDate: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  grade: { type: String },
  documentHash: { type: String, required: true },
  filePath: { type: String },
  fileType: { type: String },
  qrCode: { type: String },
  status: { type: String, enum: ['active', 'revoked', 'expired'], default: 'active' },
  verificationCount: { type: Number, default: 0 },
  lastVerified: { type: Date },
  metadata: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
