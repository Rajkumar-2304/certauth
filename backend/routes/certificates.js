const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const Certificate = require('../models/Certificate');
const { protect, authorize } = require('../middleware/auth');
const { sendEmail } = require('../utils/mailer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg', 'image/png'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type'), false);
  }
});

// @POST /api/certificates/issue
router.post('/issue', protect, authorize('admin', 'institution'), upload.single('document'), async (req, res) => {
  try {
    const { studentName, studentEmail, rollNo, admissionNo, course, institution, grade, expiryDate } = req.body;
    const certId = `CERT-${uuidv4().substring(0, 8).toUpperCase()}`;

    let documentHash = '';
    let filePath = '';
    if (req.file) {
      const fileBuffer = fs.readFileSync(req.file.path);
      documentHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      filePath = `/uploads/${req.file.filename}`;
    } else {
      const data = JSON.stringify({ studentName, course, institution, certId, timestamp: Date.now() });
      documentHash = crypto.createHash('sha256').update(data).digest('hex');
    }

    const verifyUrl = `${process.env.CLIENT_URL}/verify/${certId}`;
    const qrCode = await QRCode.toDataURL(verifyUrl);

    const certificate = await Certificate.create({
      certificateId: certId,
      studentName, studentEmail, rollNo, admissionNo,
      course, institution,
      issuedBy: req.user._id,
      grade, expiryDate,
      documentHash,
      filePath,
      fileType: req.file?.mimetype,
      qrCode,
      metadata: { issuedByName: req.user.name, issuedByRole: req.user.role }
    });

    if (studentEmail) {
      await sendEmail({
        to: studentEmail,
        subject: '🎓 Your Certificate Has Been Issued - CertAuth',
        html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:30px;background:#0a0a1a;color:#fff;border-radius:12px">
          <h2 style="color:#d4af37">Certificate Issued Successfully!</h2>
          <p>Dear ${studentName},</p>
          <p>Your certificate for <strong>${course}</strong> has been issued by <strong>${institution}</strong>.</p>
          <p><strong>Certificate ID:</strong> <span style="color:#d4af37">${certId}</span></p>
          <p>Verify at: <a href="${verifyUrl}" style="color:#d4af37">${verifyUrl}</a></p>
          <img src="${qrCode}" style="width:150px;margin-top:20px"/>
        </div>`
      });
    }

    res.status(201).json({ success: true, certificate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/certificates
router.get('/', protect, async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'institution') filter.institution = req.user.institution;
    if (req.user.role === 'student') filter.rollNo = req.user.rollNo;
    const certs = await Certificate.find(filter).populate('issuedBy', 'name email').sort('-createdAt');
    res.json({ success: true, count: certs.length, certificates: certs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/certificates/:id
router.get('/:id', async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certificateId: req.params.id }).populate('issuedBy', 'name email');
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });
    res.json({ success: true, certificate: cert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/certificates/:id/revoke
router.put('/:id/revoke', protect, authorize('admin', 'institution'), async (req, res) => {
  try {
    const cert = await Certificate.findOneAndUpdate(
      { certificateId: req.params.id },
      { status: 'revoked' },
      { new: true }
    );
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });
    res.json({ success: true, message: 'Certificate revoked', certificate: cert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
