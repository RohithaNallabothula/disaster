import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the server directory explicitly
dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'sentinel_hq_secure_99';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(express.json());

// Demo User Database
const users = [
  {
    id: 1,
    username: 'commander',
    password: 'password123',
    role: 'Commander',
    name: 'Cmdr. Rayna Vance'
  },
  {
    id: 2,
    username: 'responder',
    password: 'securePass!',
    role: 'Responder',
    name: 'Officer Jack Riggs'
  }
];

// Mock API Data
const incidents = [
  { id: 1, type: 'Seismic',      title: 'Aftershock Alert M5.4',          severity: 'High',     location: [34.0522, -118.2437] },
  { id: 2, type: 'CBRN',         title: 'Ammonia Storage Leak',            severity: 'Critical', location: [34.1022, -118.3437] },
  { id: 3, type: 'Cyclone',      title: 'Category 3 Cyclone Approaching',  severity: 'Critical', location: [13.0827,  80.2707] },
  { id: 4, type: 'Nuclear',      title: 'Coolant Pressure Anomaly',        severity: 'Critical', location: [21.6551,  69.7748] },
  { id: 5, type: 'Tsunami',      title: 'Indian Ocean Tsunami Warning',    severity: 'High',     location: [3.3194,   95.3647] },
  { id: 6, type: 'Industrial',   title: 'Refinery Explosion',              severity: 'High',     location: [22.3072,  73.1812] },
  { id: 7, type: 'Terrorism',    title: 'IED Detonation \u2014 Market District',  severity: 'Critical', location: [28.6139,  77.2090] },
  { id: 8, type: 'Flood',        title: 'Flash Flood \u2014 River Dale Basin', severity: 'Medium',   location: [25.5941,  85.1376] },
];

// Auth Endpoints
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const token = jwt.sign(
      { userId: user.id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Middleware for protected routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(0).json({ message: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Protected Data Endpoints
app.get('/api/incidents', authenticateToken, (req, res) => {
  res.json(incidents);
});

// Sensor Network Data
const sensors = [
  { id: 'S-01', type: 'Seismometer',   position: [34.0122, -118.2837], value: 2.1,  unit: 'Richter', status: 'Active' },
  { id: 'S-02', type: 'Flood Gauge',   position: [34.0822, -118.2037], value: 0.4,  unit: 'm',       status: 'Active' },
  { id: 'S-03', type: 'Radiation',     position: [34.1222, -118.3037], value: 0.012, unit: 'mSv',    status: 'Active' },
  { id: 'S-04', type: 'Air Quality',   position: [34.0622, -118.3237], value: 142,  unit: 'AQI',     status: 'Warning' },
  { id: 'S-05', type: 'Temperature',   position: [34.0322, -118.1837], value: 38.4, unit: '°C',      status: 'Active' },
  { id: 'S-06', type: 'Wind Speed',    position: [34.1022, -118.2237], value: 14.2, unit: 'm/s',     status: 'Active' },
  { id: 'S-07', type: 'CBRN Chemical', position: [34.1322, -118.3437], value: 0.003, unit: 'ppm',    status: 'Critical' },
  { id: 'S-08', type: 'Infrastructure',position: [34.0722, -118.2637], value: 6.7,  unit: 'Vib/mm',  status: 'Warning' }
];

app.get('/api/sensors', authenticateToken, (req, res) => {
  // Simulate real-time jitter on each read
  const live = sensors.map(s => ({
    ...s,
    value: parseFloat((s.value + (Math.random() - 0.5) * 0.05 * s.value).toFixed(4))
  }));
  res.json(live);
});

// AI-powered sensor analysis using Groq
app.post('/api/sensors/analyze', authenticateToken, async (req, res) => {
  const { sensorReadings } = req.body;

  if (!sensorReadings || !Array.isArray(sensorReadings)) {
    return res.status(400).json({ message: 'Invalid sensor readings provided.' });
  }

  const sensorSummary = sensorReadings.map(s =>
    `- ${s.id} (${s.type}): ${s.value} ${s.unit} [${s.status}]`
  ).join('\n');

  const prompt = `You are SENTINEL-AI, an emergency response AI assistant. Analyze the following live IoT sensor readings from a disaster monitoring platform and provide a concise threat assessment. Identify any anomalies, escalating risks, and recommend immediate actions. Be direct and terse. Format your response in 3 sections: THREAT LEVEL (one word), ANOMALIES DETECTED, and RECOMMENDED ACTIONS.\n\nLive Sensor Readings:\n${sensorSummary}`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 400,
    });

    const analysis = completion.choices[0]?.message?.content || 'No analysis available.';
    res.json({ analysis, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Groq API error:', error.message);
    res.status(500).json({ message: 'AI analysis failed.', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`SENTINEL Backend running on http://localhost:${PORT}`);
});
