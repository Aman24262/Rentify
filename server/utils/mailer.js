const nodemailer = require("nodemailer");

const cleanEnvValue = (value) => (value ? String(value).trim().replace(/\s+/g, "") : "");
const cleanEmailValue = (value) => (value ? String(value).trim() : "");

const hasMailCredentials = () =>
  Boolean(process.env.SMTP_HOST && (cleanEmailValue(process.env.SMTP_USER) || cleanEmailValue(process.env.EMAIL_USER)) && (cleanEnvValue(process.env.SMTP_PASS) || cleanEnvValue(process.env.EMAIL_PASS))) ||
  Boolean(cleanEmailValue(process.env.EMAIL_USER) && cleanEnvValue(process.env.EMAIL_PASS));

const getMailerConfig = () => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const smtpSecure = process.env.SMTP_SECURE === "true";
  const smtpUser = cleanEmailValue(process.env.SMTP_USER || process.env.EMAIL_USER);
  const smtpPass = cleanEnvValue(process.env.SMTP_PASS || process.env.EMAIL_PASS);

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

  if (cleanEmailValue(process.env.EMAIL_USER) && cleanEnvValue(process.env.EMAIL_PASS)) {
    return {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: cleanEmailValue(process.env.EMAIL_USER),
        pass: cleanEnvValue(process.env.EMAIL_PASS),
      },
    };
  }

  return {
    jsonTransport: true,
  };
};

const createMailer = () => {
  const config = getMailerConfig();
  const transport = nodemailer.createTransport(config);

  if (process.env.NODE_ENV === "production") {
    const provider = config.jsonTransport
      ? "jsonTransport"
      : config.service || config.host || "custom";

    console.log(`Rentify mailer initialized with ${provider} transport`);

    if (!hasMailCredentials()) {
      console.error(
        "Rentify mailer is running without SMTP credentials in production. Set EMAIL_USER and EMAIL_PASS, or SMTP_HOST/SMTP_USER/SMTP_PASS, plus ADMIN_EMAIL in Render env vars."
      );
    }
  }

  if (process.env.NODE_ENV === "production" && config.jsonTransport) {
    console.error(
      "Rentify mailer fell back to jsonTransport in production, so no real email will be delivered. Update Render env vars and redeploy."
    );
  }

  return transport;
};

const getFromAddress = () => cleanEmailValue(process.env.SMTP_FROM || process.env.EMAIL_USER) || "no-reply@rentify.com";

const getAdminEmail = () => cleanEmailValue(process.env.ADMIN_EMAIL || process.env.EMAIL_USER) || "admin@rentify.com";

module.exports = {
  createMailer,
  getFromAddress,
  getAdminEmail,
};