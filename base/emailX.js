// Before building module Class Email
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter with prod & dev
  let transporter;

  if (process.env.NODE_ENV === 'production') {
    // PRODUCTION: Gmail
    transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD, // app password
      },
    });
  } else {
    // DEVELOPMENT: Mailtrap
    transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
  }

  // 2) Define the email options
  const mailOptions = {
    from: `Natours-2025 Support <${process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
