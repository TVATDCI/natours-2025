// utils/email.js
const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');
const sgMail = require('@sendgrid/mail');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Natours - 2025 <${process.env.EMAIL_FROM}>`;
  }

  // === Email sending logic ===
  async send(template, subject) {
    // 1. Render Pug template into HTML
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      },
    );

    // 2. Define message
    const msg = {
      to: this.to,
      from: this.from,
      subject,
      text: convert(html),
      html,
    };

    try {
      if (process.env.NODE_ENV === 'production') {
        // === Send via Twilio SendGrid API ===
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        console.log('🟢 Using SendGrid API to send email...');
        await sgMail.send(msg);

        console.log(`📨 Email successfully sent to ${this.to}`);
      } else {
        // === Development: use Mailtrap ===
        console.log('🧰 Using Mailtrap (development mode)');

        const transporter = nodemailer.createTransport({
          host: process.env.MAILTRAP_HOST,
          port: process.env.MAILTRAP_PORT,
          auth: {
            user: process.env.MAILTRAP_USERNAME,
            pass: process.env.MAILTRAP_PASSWORD,
          },
        });

        await transporter.verify();
        await transporter.sendMail(msg);

        console.log(`📧 Dev email sent to ${this.to}`);
      }
    } catch (err) {
      console.error('🔴 Email send failed:', err.response?.body || err);
      throw new Error('Email delivery failed');
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Natours - 2025!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
};
