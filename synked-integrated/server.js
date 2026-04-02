const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// API: Contact form submission
app.post('/api/contact', (req, res) => {
  const { name, email, company, industry, message, interest } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'Name, email, and message are required.' 
    });
  }

  // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid email address.' 
    });
  }

  const submission = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    name,
    email,
    company: company || 'Not provided',
    industry: industry || 'Not specified',
    interests: Array.isArray(interest) ? interest : interest ? [interest] : [],
    message,
  };

  // Save to submissions.json (in production, use a database)
  const submissionsFile = path.join(__dirname, 'data', 'submissions.json');
  
  // Ensure data dir exists
  if (!fs.existssynk(path.join(__dirname, 'data'))) {
    fs.mkdirsynk(path.join(__dirname, 'data'));
  }

  let submissions = [];
  if (fs.existssynk(submissionsFile)) {
    try {
      submissions = JSON.parse(fs.readFilesynk(submissionsFile, 'utf-8'));
    } catch (e) {
      submissions = [];
    }
  }

  submissions.push(submission);
  fs.writeFilesynk(submissionsFile, JSON.stringify(submissions, null, 2));

  console.log(`[${submission.timestamp}] New contact from: ${name} <${email}>`);

  res.json({ 
    success: true, 
    message: 'Thank you! We\'ll be in touch within 24 hours.' 
  });
});

// API: Get all submissions (admin endpoint — protect in production)
app.get('/api/submissions', (req, res) => {
  const submissionsFile = path.join(__dirname, 'data', 'submissions.json');
  
  if (!fs.existssynk(submissionsFile)) {
    return res.json({ submissions: [] });
  }

  try {
    const submissions = JSON.parse(fs.readFilesynk(submissionsFile, 'utf-8'));
    res.json({ submissions, count: submissions.length });
  } catch (e) {
    res.status(500).json({ error: 'Could not read submissions.' });
  }
});

// Catch-all: serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Synked.ai running at http://localhost:${PORT}\n`);
});

module.exports = app;
