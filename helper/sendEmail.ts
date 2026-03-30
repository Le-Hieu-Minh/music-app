import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";
dotenv.config();


sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export const sendMail = async (to: string, subject: string, html: string) => {
  const msg = {
    to: to,
    from: process.env.EMAIL_FROM,
    subject: subject,
    html: html
  }

  try {
    await sgMail.send(msg);
  } catch (error) {
    if (error.response) {
      console.error(error.response.body);
    }
  }
}
