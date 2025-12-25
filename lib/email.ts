import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || '"WishPay" <noreply@wishpay.com>',
    to: email,
    subject: 'Verify your email address - WishPay',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to WishPay!</h2>
        <p>Please click the button below to verify your email address and activate your account.</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #103B6D; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0;">Verify Email</a>
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account with WishPay, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || '"WishPay" <noreply@wishpay.com>',
    to: email,
    subject: 'Reset your password - WishPay',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset Your Password</h2>
        <p>You requested a password reset for your WishPay account.</p>
        <p>Please click the button below to set a new password.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #103B6D; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0;">Reset Password</a>
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};