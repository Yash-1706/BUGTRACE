const nodemailer = require('nodemailer');
const { logError, logInfo, logWarn } = require('./logger');

let transporter;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  if (!process.env.MAIL_HOST || !process.env.MAIL_PORT || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
    logWarn('Email environment variables missing. Emails will not be sent.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: Number(process.env.MAIL_PORT) === 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  return transporter;
};

const sendEmail = async ({ to, subject, html, text }) => {
  const mailer = getTransporter();
  if (!mailer) {
    logWarn('Attempted to send email without transporter', { to, subject });
    return;
  }

  try {
    await mailer.sendMail({
      from: process.env.MAIL_FROM || 'no-reply@bugtrace.app',
      to,
      subject,
      html,
      text,
    });
    logInfo('Email sent successfully', { to, subject });
  } catch (error) {
    logError('Failed to send email', error);
  }
};

module.exports = {
  sendEmail,
};
