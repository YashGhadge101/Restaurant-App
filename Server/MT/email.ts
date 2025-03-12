import Nodemailer from "nodemailer";
import dotenv from "dotenv";
import { htmlContent, generateWelcomeEmailHtml, generatePasswordResetEmailHtml, generateResetSuccessEmailHtml } from "./htmlEmail";

dotenv.config();

// ✅ Configure Gmail SMTP
const transporter = Nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,  // ✅ Use your Gmail ID
        pass: process.env.GMAIL_PASS,  // ✅ Use your App Password
    },
});



// ✅ Send Verification Email
export const sendVerificationEmail = async (email: string, verificationToken: string) => {
    try {
        await transporter.sendMail({
            from: `"Your App Name" <${process.env.GMAIL_USER}>`,  // ✅ Gmail Sender
            to: email,  
            subject: "Verify Your Email",
            html: `<p>Your verification code is: <strong>${verificationToken}</strong></p>`,
        });
        console.log("✅ Verification email sent successfully!");
    } catch (error) {
        console.error("❌ Error sending verification email:", error);
        throw new Error("Failed to send email verification");
    }
};

// ✅ Send Welcome Email
export const sendWelcomeEmail = async (email: string, name: string) => {
    const htmlContent = generateWelcomeEmailHtml(name);
    try {
        await transporter.sendMail({
            from: `"Your App Name" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: "Welcome to PatelEats",
            html: htmlContent,
        });
        console.log("✅ Welcome email sent successfully!");
    } catch (error) {
        console.error("❌ Error sending welcome email:", error);
        throw new Error("Failed to send welcome email");
    }
};

// ✅ Send Password Reset Email
export const sendPasswordResetEmail = async (email: string, resetURL: string) => {
    const htmlContent = generatePasswordResetEmailHtml(resetURL);
    try {
        await transporter.sendMail({
            from: `"Your App Name" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: "Reset Your Password",
            html: htmlContent,
        });
        console.log("✅ Password reset email sent successfully!");
    } catch (error) {
        console.error("❌ Error sending password reset email:", error);
        throw new Error("Failed to reset password");
    }
};

// ✅ Send Password Reset Success Email
export const sendResetSuccessEmail = async (email: string) => {
    const htmlContent = generateResetSuccessEmailHtml();
    try {
        await transporter.sendMail({
            from: `"Your App Name" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: "Password Reset Successfully",
            html: htmlContent,
        });
        console.log("✅ Password reset success email sent!");
    } catch (error) {
        console.error("❌ Error sending password reset success email:", error);
        throw new Error("Failed to send password reset success email");
    }
};
