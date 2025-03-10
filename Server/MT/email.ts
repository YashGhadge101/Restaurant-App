import Nodemailer from "nodemailer";
import { htmlContent, generateWelcomeEmailHtml, generatePasswordResetEmailHtml, generateResetSuccessEmailHtml } from "./htmlEmail";
import dotenv from "dotenv";

dotenv.config();

const transporter = Nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io", 
  port: 2525,  
  secure: false,
  auth: {
    user: process.env.MAILTRAP_USER, 
    pass: process.env.MAILTRAP_PASS
  }
});

export const sender = {
  name: "Mailtrap Test",
  address: "hello@demomailtrap.co",
};

export const sendVerificationEmail = async (email: string, verificationToken: string) => {
    try {
        await transporter.sendMail({
            from: `"Mailtrap Test" <hello@demomailtrap.co>`,  // ✅ Fixed `from`
            to: email,  
            subject: 'Verify your email',
            html: htmlContent.replace("{verificationToken}", verificationToken),
        });
        console.log("✅ Verification email sent successfully!");
    } catch (error) {
        console.error("❌ Error sending verification email:", error);
        throw new Error("Failed to send email verification");
    }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
    const htmlContent = generateWelcomeEmailHtml(name);
    try {
        await transporter.sendMail({
            from: `"Mailtrap Test" <hello@demomailtrap.co>`,
            to: email,
            subject: 'Welcome to PatelEats',
            html: htmlContent,
        });
        console.log("✅ Welcome email sent successfully!");
    } catch (error) {
        console.error("❌ Error sending welcome email:", error);
        throw new Error("Failed to send welcome email");
    }
};

export const sendPasswordResetEmail = async (email: string, resetURL: string) => {
    const htmlContent = generatePasswordResetEmailHtml(resetURL);
    try {
        await transporter.sendMail({
            from: `"Mailtrap Test" <hello@demomailtrap.co>`,
            to: email,
            subject: 'Reset your password',
            html: htmlContent,
        });
        console.log("✅ Password reset email sent successfully!");
    } catch (error) {
        console.error("❌ Error sending password reset email:", error);
        throw new Error("Failed to reset password");
    }
};

export const sendResetSuccessEmail = async (email: string) => {
    const htmlContent = generateResetSuccessEmailHtml();
    try {
        await transporter.sendMail({
            from: `"Mailtrap Test" <hello@demomailtrap.co>`,
            to: email,
            subject: 'Password Reset Successfully',
            html: htmlContent,
        });
        console.log("✅ Password reset success email sent!");
    } catch (error) {
        console.error("❌ Error sending password reset success email:", error);
        throw new Error("Failed to send password reset success email");
    }
};
