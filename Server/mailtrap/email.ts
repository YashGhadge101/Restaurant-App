import { generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } from "./htmlEmail";
import { sender } from "./mailtrap";
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

const client = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    },
});

export const sendVerificationEmail = async (email: string, verificationToken: string) => {
    try {
        console.log(client); 
        const res = await client.sendMail({ 
            from: process.env.MAILTRAP_SENDER, 
            to: email, 
            subject: 'Verify your email',
            html: htmlContent.replace("{verificationToken}", verificationToken),
        });
        console.log("✅ Email Sent:", res);
    } catch (error: any) {
        console.error("Error sending email:", error);
        if (error.response) {
            console.error("Mailtrap response:", error.response);
        }
        if (error.message) {
            console.error("Error message:", error.message);
        }
        throw new Error("Failed to send email verification");
    }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
    const htmlContent = generateWelcomeEmailHtml(name);
    try {
        const res = await client.sendMail({ 
            from: sender,
            to: email,
            subject: 'Welcome to PatelEats',
            html: htmlContent,
        });
        console.log("✅ Welcome Email Sent:", res);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to send welcome email");
    }
};

export const sendPasswordResetEmail = async (email: string, resetURL: string) => {
    const htmlContent = generatePasswordResetEmailHtml(resetURL);
    try {
        const res = await client.sendMail({ 
            from: sender,
            to: email,
            subject: 'Reset your password',
            html: htmlContent,
        });
        console.log("✅ Password Reset Email Sent:", res);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to send password reset email");
    }
};

export const sendResetSuccessEmail = async (email: string) => {
    const htmlContent = generateResetSuccessEmailHtml();
    try {
        const res = await client.sendMail({ 
            from: sender,
            to: email,
            subject: 'Password Reset Successfully',
            html: htmlContent,
        });
        console.log("✅ Password Reset Success Email Sent:", res);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to send password reset success email");
    }
};
