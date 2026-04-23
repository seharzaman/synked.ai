const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { name, email, company, industry, message, interest } = JSON.parse(event.body);

  if (!name || !email || !message) {
    return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Required fields missing.' }) };
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SYNKED_EMAIL,
      pass: process.env.SYNKED_PASS,
    },
  });

  const interests = Array.isArray(interest) ? interest : interest ? [interest] : [];
  const timestamp = new Date().toISOString();

  try {
    await transporter.sendMail({
      from: `"${name}" <${process.env.SYNKED_EMAIL}>`,
      to: process.env.NOTIFY_TO,
      replyTo: email,
      subject: `New Contact: ${name} — ${company || 'No company'}`,
      html: `
        <h2 style="color:#4f46e5">New Contact Form Submission</h2>
        <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse">
          <tr><td style="padding:6px 12px;font-weight:bold">Name</td><td>${name}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold">Email</td><td>${email}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold">Company</td><td>${company || '—'}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold">Industry</td><td>${industry || '—'}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold">Interests</td><td>${interests.join(', ') || '—'}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;vertical-align:top">Message</td><td style="white-space:pre-wrap">${message}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold">Submitted</td><td>${timestamp}</td></tr>
        </table>
      `,
    });
    return { statusCode: 200, body: JSON.stringify({ success: true, message: "Thank you! We'll be in touch within 24 hours." }) };
  } catch (err) {
    console.error('Email error:', err);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: 'Email failed.' }) };
  }
};