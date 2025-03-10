import Nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";

const transport = Nodemailer.createTransport(
  MailtrapTransport({
    testInboxId: 3502555,
    token: "30e6bcfe335d7b18d2093f2352dc8b32"
  })
);

const sender = {
  address: "hello@example.com",
  name: "Mailtrap Test",
};
const recipients = [
  "yashghadge1009@gmail.com",
];

transport
  .sendMail({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
    sandbox: true
  })
  .then(console.log, console.error);