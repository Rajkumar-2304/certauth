const express       = require('express');
const mongoose      = require('mongoose');
const cors          = require('cors');
const serverless    = require('serverless-http');
const rateLimit     = require('express-rate-limit');
require('dotenv').config();

const app = express();

// ── Trust proxy (required for rate-limiter behind Netlify edge) ──
app.set('trust proxy', 1);

// ── Rate limiting ────────────────────────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  validate: { xForwardedForHeader: false }
}));

// ── CORS ─────────────────────────────────────────────────────────
// On Netlify: same domain = no CORS issues for production.
// CLIENT_URL is still used for QR code verify URLs in certificates.
app.use(cors({
  origin: '*',   // same-domain on Netlify; lock down after confirming it works
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ── Routes ───────────────────────────────────────────────────────
app.use('/api/auth',         require('../../backend/routes/auth'));
app.use('/api/certificates', require('../../backend/routes/certificates'));
app.use('/api/verify',       require('../../backend/routes/verify'));
app.use('/api/analytics',    require('../../backend/routes/analytics'));

// ── Health check ─────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ── MongoDB (cached connection across warm invocations) ──────────
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
  console.log('✅ MongoDB connected');
};

// ── Handler ──────────────────────────────────────────────────────
const handler = serverless(app);

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectDB();
  return handler(event, context);
};
