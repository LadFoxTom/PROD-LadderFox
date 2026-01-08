import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  // Use environment variables for email configuration
  const host = process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_SERVER_PORT || '587');
  const user = process.env.EMAIL_SERVER_USER;
  const password = process.env.EMAIL_SERVER_PASSWORD;
  const from = process.env.EMAIL_FROM || 'noreply@ladderfox.com';

  if (!user || !password) {
    console.warn('Email server credentials not configured. Emails will not be sent.');
    console.warn('Required environment variables: EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD');
    return null;
  }

  // For Gmail: You can't send FROM noreply@ladderfox.com directly
  // The "from" address will be your Gmail address, but you can set a display name
  // For custom domain emails, use a service like SendGrid, Mailgun, or AWS SES
  
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass: password,
    },
  });

  // Verify connection (async, won't block)
  transporter.verify((error, success) => {
    if (error) {
      console.error('Email server connection error:', error);
    } else {
      console.log('Email server is ready to send messages');
    }
  });

  return transporter;
};

export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.error('Email transporter not available. Cannot send password reset email.');
    console.error('Missing environment variables:', {
      hasHost: !!process.env.EMAIL_SERVER_HOST,
      hasPort: !!process.env.EMAIL_SERVER_PORT,
      hasUser: !!process.env.EMAIL_SERVER_USER,
      hasPassword: !!process.env.EMAIL_SERVER_PASSWORD,
    });
    return false;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'https://www.ladderfox.com';
  const resetUrl = `${appUrl}/auth/reset-password?token=${resetToken}`;
  const fromEmail = process.env.EMAIL_FROM || 'noreply@ladderfox.com';

  console.log('Attempting to send password reset email:', {
    to: email,
    from: fromEmail,
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
  });

  // Note: If using Gmail, the "from" address must be your Gmail address
  // You can use a display name like: "LadderFox <your-email@gmail.com>"
  // For custom domain emails (noreply@ladderfox.com), use SendGrid, Mailgun, or AWS SES
  // If EMAIL_FROM is set and different from EMAIL_SERVER_USER, use it with display name
  const fromAddress = process.env.EMAIL_FROM && process.env.EMAIL_FROM !== process.env.EMAIL_SERVER_USER
    ? `LadderFox <${process.env.EMAIL_FROM}>`
    : process.env.EMAIL_SERVER_USER || fromEmail;

  const mailOptions = {
    from: fromAddress,
    to: email,
    subject: 'Reset Your LadderFox Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">LadderFox</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
            <p>You requested to reset your password for your LadderFox account.</p>
            <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
            </div>
            <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="color: #667eea; word-break: break-all; font-size: 12px;">${resetUrl}</p>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">If you didn't request this password reset, you can safely ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} LadderFox. All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
    text: `
      Reset Your LadderFox Password
      
      You requested to reset your password for your LadderFox account.
      
      Click this link to reset your password (expires in 1 hour):
      ${resetUrl}
      
      If you didn't request this password reset, you can safely ignore this email.
      
      © ${new Date().getFullYear()} LadderFox. All rights reserved.
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', {
      messageId: info.messageId,
      to: email,
      from: fromEmail,
    });
    return true;
  } catch (error: any) {
    console.error('Error sending password reset email:', {
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      to: email,
    });
    return false;
  }
};
