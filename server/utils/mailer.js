const nodemailer = require("nodemailer");

const getMailerConfig = () => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const smtpSecure = process.env.SMTP_SECURE === "true";
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    return {
      host: smtpHost,
      port: smtpPort || (smtpSecure ? 465 : 587),
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    };
  }

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return {
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };
  }

  return {
    jsonTransport: true,
  };
};

const createMailer = () => nodemailer.createTransport(getMailerConfig());

const getFromAddress = () => process.env.SMTP_FROM || process.env.EMAIL_USER || "no-reply@rentify.com";

const getAdminEmail = () => process.env.ADMIN_EMAIL || process.env.EMAIL_USER || "admin@rentify.com";

module.exports = {
  createMailer,
  getFromAddress,
  getAdminEmail,
};