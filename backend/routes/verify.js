const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const Certificate = require('../models/Certificate');

// @GET /api/verify/:certId
router.get('/:certId', async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certificateId: req.params.certId })
      .populate('issuedBy', 'name email institution');

    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found in database', verified: false });

    cert.verificationCount += 1;
    cert.lastVerified = new Date();
    await cert.save();

    const isActive = cert.status === 'active';
    const isExpired = cert.expiryDate && new Date() > cert.expiryDate;

    res.json({
      success: true,
      verified: isActive && !isExpired,
      status: isExpired ? 'expired' : cert.status,
      certificate: {
        certificateId: cert.certificateId,
        studentName: cert.studentName,
        rollNo: cert.rollNo,
        course: cert.course,
        institution: cert.institution,
        issueDate: cert.issueDate,
        expiryDate: cert.expiryDate,
        grade: cert.grade,
        documentHash: cert.documentHash,
        issuedBy: cert.metadata?.issuedByName,
        verificationCount: cert.verificationCount
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/verify/hash
router.post('/hash', async (req, res) => {
  try {
    const { certId, fileContent } = req.body;
    const cert = await Certificate.findOne({ certificateId: certId });
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found', verified: false });

    const uploadedHash = crypto.createHash('sha256').update(fileContent).digest('hex');
    const hashMatch = uploadedHash === cert.documentHash;

    res.json({
      success: true,
      verified: hashMatch && cert.status === 'active',
      hashMatch,
      originalHash: cert.documentHash,
      uploadedHash,
      status: cert.status
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
