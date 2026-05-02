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

// ── CORS — same domain on Netlify, keep localhost for dev ────────
app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    'http://localhost:3000'
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ── Routes ───────────────────────────────────────────────────────
app.use('/api/auth',         require('../../backend/routes/auth'));
app.use('/api/certificates', require('../../backend/routes/certificates'));
app.use('/api/verify',       require('../../backend/routes/verify'));
app.use('/api/analytics',    require('../../backend/routes/analytics'));

// ── MongoDB (cached connection across warm lambda invocations) ───
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
  // Prevent Lambda from waiting for empty event loop
  context.callbackWaitsForEmptyEventLoop = false;
  await connectDB();
  return handler(event, context);
};
