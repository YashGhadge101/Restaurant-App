import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";

dotenv.config();

const mailtrapApiToken = process.env.MAILTRAP_API_TOKEN;
const senderEmail = process.env.MAILTRAP_SENDER_EMAIL;

if (!mailtrapApiToken) {
  throw new Error("Missing MAILTRAP_API_TOKEN environment variable.");
}

if (!senderEmail) {
  throw new Error("Missing MAILTRAP_SENDER_EMAIL environment variable.");
}


export const client = nodemailer.createTransport(
  MailtrapTransport({
    token: mailtrapApiToken,
  })
);
client.setMaxListeners(0); 

const senderName = process.env.MAILTRAP_SENDER_NAME || "Your App";
export const sender = `"${senderName}" <${senderEmail}>`;