require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');

if (!process.env.JWT_SECRET) { console.error('Missing JWT_SECRET in .env'); process.exit(1); }

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/submissions', require('./routes/submissions'));

app.use('/api', (req, res) => res.status(404).json({ error: 'Route not found.' }));
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ error: 'Server error. Please try again.' }); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Portal running at http://localhost:${PORT}`));
