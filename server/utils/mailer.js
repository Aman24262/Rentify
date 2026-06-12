const nodemailer = require("nodemailer");

const hasMailCredentials = () =>
  Boolean(process.env.SMTP_HOST && (process.env.SMTP_USER || process.env.EMAIL_USER) && (process.env.SMTP_PASS || process.env.EMAIL_PASS)) ||
  Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

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

const createMailer = () => {
  const transport = nodemailer.createTransport(getMailerConfig());

  if (process.env.NODE_ENV === "production" && !hasMailCredentials()) {
    console.error(
      "Rentify mailer is running without SMTP credentials in production. Set EMAIL_USER and EMAIL_PASS, or SMTP_HOST/SMTP_USER/SMTP_PASS, plus ADMIN_EMAIL in Render env vars."
    );
  }

  return transport;
};

const getFromAddress = () => process.env.SMTP_FROM || process.env.EMAIL_USER || "no-reply@rentify.com";

const getAdminEmail = () => process.env.ADMIN_EMAIL || process.env.EMAIL_USER || "admin@rentify.com";

module.exports = {
  createMailer,
  getFromAddress,
  getAdminEmail,
};