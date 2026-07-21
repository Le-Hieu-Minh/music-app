import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";
dotenv.config();

interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  html: string;
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendMail = async (to: string, subject: string, html: string) => {
  const msg: EmailOptions = {
    to: to,
    from: process.env.EMAIL_FROM!,
    subject: subject,
    html: html
  };

  await sgMail.send(msg);
};
