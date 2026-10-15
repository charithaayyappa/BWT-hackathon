// Optional demo data: npm run seed
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./db');
const hash = bcrypt.hashSync('password123', 10);
const add = db.prepare('INSERT OR IGNORE INTO users (name,email,password_hash,role) VALUES (?,?,?,?)');
add.run('Prof. Meera Rao', 'teacher@demo.com', hash, 'teacher');
add.run('Aarav Sharma', 'student@demo.com', hash, 'student');
const t = db.prepare("SELECT id FROM users WHERE email='teacher@demo.com'").get().id;
const day = 86400000;
const a = db.prepare('INSERT INTO assignments (title,description,deadline,max_marks,teacher_id) VALUES (?,?,?,?,?)');
a.run('REST API Design Report', 'Write a 4-page report comparing REST and GraphQL with examples.', new Date(Date.now() + 3 * day).toISOString(), 50, t);
a.run('Database Normalization Worksheet', 'Normalize the given schema up to 3NF and submit your ER diagram.', new Date(Date.now() + 8 * day).toISOString(), 20, t);
a.run('Express Middleware Lab', 'Submit a zip of your auth middleware project.', new Date(Date.now() - 2 * day).toISOString(), 100, t);
console.log('Seeded. Teacher: teacher@demo.com / Student: student@demo.com (password: password123)');
