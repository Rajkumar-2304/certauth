const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin', 'institution'), async (req, res) => {
  try {
    const filter = req.user.role === 'institution' ? { institution: req.user.institution } : {};

    const [total, active, revoked, verifications, recentCerts, topInstitutions] = await Promise.all([
      Certificate.countDocuments(filter),
      Certificate.countDocuments({ ...filter, status: 'active' }),
      Certificate.countDocuments({ ...filter, status: 'revoked' }),
      Certificate.aggregate([{ $group: { _id: null, total: { $sum: '$verificationCount' } } }]),
      Certificate.find(filter).sort('-createdAt').limit(5).select('certificateId studentName course status createdAt'),
      Certificate.aggregate([
        { $group: { _id: '$institution', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);

    // Monthly data for chart
    const monthlyData = await Certificate.aggregate([
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      stats: {
        total,
        active,
        revoked,
        expired: total - active - revoked,
        totalVerifications: verifications[0]?.total || 0
      },
      recentCerts,
      topInstitutions,
      monthlyData
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
