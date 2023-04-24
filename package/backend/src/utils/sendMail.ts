import nodeMailer from "nodemailer";

export const sendMail = async (email: string | undefined, subject: string, message: string) => {
  const config = {
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.NODEMAILER_MAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  };

  const mail = {
    From: process.env.NODEMAILER_MAIL,
    to: email,
    subject,
    html: message,
  };

  const transport = nodeMailer.createTransport(config);
  await transport.sendMail(mail);
};
