const express = require('express');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── EMAIL CONFIG ──────────────────────────────────────────────
// Replace these values with your actual Synked email credentials
const SYNKED_EMAIL = 'audit@sellerfactor.com';           // your actual Google Workspace email
const SYNKED_PASS  = 'xsmt xqec fbih pbmc';     // the 16-char App Password (spaces are fine)
const NOTIFY_TO    = 'hello@synked.ai';           // same or different synked.ai address

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',   // ← this is the key change for Google Workspace
  port: 465,
  secure: true,
  auth: {
    user: SYNKED_EMAIL,
    pass: SYNKED_PASS,
  },
});
// ──────────────────────────────────────────────────────────────

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// API: Contact form submission
app.post('/api/contact', async (req, res) => {
  const { name, email, company, industry, message, interest } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address.' });
  }

  const interests = Array.isArray(interest) ? interest : interest ? [interest] : [];

  const submission = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    name, email,
    company: company || 'Not provided',
    industry: industry || 'Not specified',
    interests,
    message,
  };

  // Save to local JSON backup
  const dataDir = path.join(__dirname, 'data');
  const submissionsFile = path.join(dataDir, 'submissions.json');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  let submissions = [];
  if (fs.existsSync(submissionsFile)) {
    try { submissions = JSON.parse(fs.readFileSync(submissionsFile, 'utf-8')); } catch (e) {}
  }
  submissions.push(submission);
  fs.writeFileSync(submissionsFile, JSON.stringify(submissions, null, 2));

  // Send email notification
  try {
    await transporter.sendMail({
      from: `"${name}"`,
      to: NOTIFY_TO,
      replyTo: email,
      subject: `New Contact: ${name} — ${company || 'No company'}`,
      html: `
        <h2 style="color:#4f46e5">New Contact Form Submission</h2>
        <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse">
          <tr><td style="padding:6px 12px;font-weight:bold">Name</td><td style="padding:6px 12px">${name}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold">Email</td><td style="padding:6px 12px"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold">Company</td><td style="padding:6px 12px">${company || '—'}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold">Industry</td><td style="padding:6px 12px">${industry || '—'}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold">Interests</td><td style="padding:6px 12px">${interests.join(', ') || '—'}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;vertical-align:top">Message</td><td style="padding:6px 12px;white-space:pre-wrap">${message}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold">Submitted</td><td style="padding:6px 12px">${submission.timestamp}</td></tr>
        </table>
        <p style="margin-top:20px;font-size:13px;color:#888">Hit Reply to respond directly to ${name}.</p>
      `,
    });
    console.log(`[${submission.timestamp}] ✅ Email sent for: ${name} <${email}>`);
  } catch (err) {
    console.error('❌ Email send failed:', err);
    // Still return success to user — submission was saved
  }

  res.json({ success: true, message: "Thank you! We'll be in touch within 24 hours." });
});

// Admin: view submissions
app.get('/api/submissions', (req, res) => {
  const submissionsFile = path.join(__dirname, 'data', 'submissions.json');
  if (!fs.existsSync(submissionsFile)) return res.json({ submissions: [], count: 0 });
  try {
    const submissions = JSON.parse(fs.readFileSync(submissionsFile, 'utf-8'));
    res.json({ submissions, count: submissions.length });
  } catch (e) {
    res.status(500).json({ error: 'Could not read submissions.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Synked.ai running at http://localhost:${PORT}\n`);
});

module.exports = app;