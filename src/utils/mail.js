import nodemailer from "nodemailer";
import { MAIL_PASS, MAIL_PORT, MAIL_SERVICE, MAIL_USER } from "../constants/constants.js";
import ApiError from "./apiError.js";
import Mailgen from "mailgen";
import { NODE_ENV } from "../constants/constants.js";
import { asyncHandler } from "./asyncHandler.js";

async function sendMail(options) {
  // Create a test account or replace with real credentials.
  try {
    const transporter = nodemailer.createTransport({
      host: MAIL_SERVICE,
      port: MAIL_PORT,
      secure: NODE_ENV === "development" ? false : true,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });

    const { emailBody, emailText } = mailgenConfig(options.mailFormat);

    // Wrap in an async IIFE so we can use await.

    await transporter.sendMail({
      from: '"Nike" <contact@nike.com>',
      to: options.email,
      subject: options.subject,
      text: emailText, // plain‑text body
      html: emailBody, // HTML body
    });
  } catch (error) {
    throw ApiError.serverError(error.message);
  }
}

function mailgenConfig(mailFormat) {
  // Configure mailgen by setting a theme and your product info
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      // Appears in header & footer of e-mails
      name: "Nike",
      link: "https://nike.com",
      // Optional product logo
      // logo: 'https://mailgen.js/img/logo.png'
    },
  });

  // Generate an HTML email with the provided contents
  const emailBody = mailGenerator.generate(mailFormat);

  // Generate the plaintext version of the e-mail (for clients that do not support HTML)
  const emailText = mailGenerator.generatePlaintext(mailFormat);

  return { emailBody, emailText };
}

function verifyEmailFormat(name, verifyUrl) {
  return {
    body: {
      name: name,
      intro: "Welcome to Nike! We are very excited to have you on board!",
      action: [
        {
          instructions: "To get started with Nike, please click here:",
          button: {
            color: "#22BC66",
            text: "Confirm your account",
            link: verifyUrl,
          },
        },
      ],
      outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
}

function forgotPasswordFormat(name, otp) {
  return {
    body: {
      name: name,
      intro: `Hi ${name}, we recieved a request to recieve your password.`,
      action: {
        instructions: `Use the following One time password (OTP) to reset your password.`,
        button: {
          color: "#22BC66",
          text: `${otp}`,
          link: "#",
        },
      },
      outro:
        "If you didn't request this, you can ignore this message. For help, just reply to this email.",
    },
  };
}



export { sendMail, verifyEmailFormat, forgotPasswordFormat };
