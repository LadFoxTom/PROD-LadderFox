import { Resend } from 'resend';

// Initialize Resend client
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const sendPasswordResetEmail = async (email: string, resetToken: string, returnError = false) => {
  if (!resend) {
    const error = 'Resend API key not configured. Required environment variable: RESEND_API_KEY';
    console.error(error);
    if (returnError) throw new Error(error);
    return false;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'https://www.ladderfox.com';
  // URL encode the token to ensure it's properly handled in the email link
  const resetUrl = `${appUrl}/auth/reset-password?token=${encodeURIComponent(resetToken)}`;
  
  // Use noreply@ladderfox.com if EMAIL_FROM is set and domain is verified
  // Otherwise fall back to onboarding@resend.dev
  const requestedFrom = process.env.EMAIL_FROM;
  const useFromEmail = requestedFrom && requestedFrom.includes('@ladderfox.com')
    ? requestedFrom
    : (requestedFrom || 'onboarding@resend.dev');

  console.log('Attempting to send password reset email via Resend:', {
    to: email,
    from: useFromEmail,
    domainVerified: useFromEmail.includes('@ladderfox.com'),
  });

  // Set reply-to to info email (better deliverability)
  const replyTo = 'info@ladderfox.com';
  
  try {
    const { data, error } = await resend.emails.send({
      from: useFromEmail,
      to: email,
      replyTo: replyTo,
      subject: 'Reset Your LadderFox Password',
      headers: {
        'List-Unsubscribe': `<${appUrl}/unsubscribe?email=${encodeURIComponent(email)}>`,
        'X-Entity-Ref-ID': `password-reset-${Date.now()}`,
      },
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>Reset Your LadderFox Password</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; line-height: 1.6; color: #333333;">
            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5; padding: 20px;">
              <tr>
                <td align="center" style="padding: 20px 0;">
                  <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">LadderFox</h1>
                      </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px; font-weight: 600;">Password Reset Request</h2>
                        <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px;">Hello,</p>
                        <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px;">We received a request to reset the password for your LadderFox account associated with this email address.</p>
                        <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px;">Click the button below to create a new password. This link will expire in 1 hour for security reasons.</p>
                        <!-- CTA Button -->
                        <table role="presentation" style="width: 100%; margin: 30px 0;">
                          <tr>
                            <td align="center" style="padding: 0;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                <tr>
                                  <td align="center" valign="middle" style="background-color: #667eea; border-radius: 6px; padding: 0;">
                                    <a href="${resetUrl}" style="display: block; background-color: #667eea; border: 2px solid #667eea; border-radius: 6px; color: #ffffff !important; text-decoration: none; padding: 16px 40px; font-weight: 600; font-size: 16px; text-align: center; line-height: 1.5; mso-hide: all; -webkit-text-size-adjust: none;">Reset Password</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <!-- Alternative Link -->
                        <p style="margin: 30px 0 10px 0; color: #999999; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
                        <p style="margin: 0 0 30px 0; color: #667eea; word-break: break-all; font-size: 14px; line-height: 1.5;">${resetUrl}</p>
                        <!-- Security Notice -->
                        <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; margin: 30px 0; border-radius: 4px;">
                          <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;"><strong>Didn't request this?</strong> If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                        </div>
                        <!-- Expiry Notice -->
                        <p style="margin: 20px 0 0 0; color: #999999; font-size: 13px;">This password reset link expires in 1 hour.</p>
                      </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                        <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px;">© ${new Date().getFullYear()} LadderFox. All rights reserved.</p>
                        <p style="margin: 0; color: #999999; font-size: 12px;">
                          <a href="${appUrl}" style="color: #667eea; text-decoration: none;">Visit LadderFox</a> | 
                          <a href="${appUrl}/support" style="color: #667eea; text-decoration: none;">Support</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `
Password Reset Request - LadderFox

Hello,

We received a request to reset the password for your LadderFox account associated with this email address.

Click the link below to create a new password. This link will expire in 1 hour for security reasons.

${resetUrl}

Didn't request this? If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

This password reset link expires in 1 hour.

© ${new Date().getFullYear()} LadderFox. All rights reserved.
Visit us at: ${appUrl}
      `.trim(),
    });

    if (error) {
      const errorDetails = {
        message: error.message,
        name: error.name,
        statusCode: error.statusCode,
        error: JSON.stringify(error, null, 2),
      };
      console.error('Resend API error:', errorDetails);
      if (returnError) {
        throw new Error(`Resend API error: ${error.message} (Status: ${error.statusCode || 'unknown'})`);
      }
      return false;
    }

    if (!data) {
      const error = 'Resend returned no data and no error - unexpected response';
      console.error(error);
      if (returnError) throw new Error(error);
      return false;
    }

    console.log('Password reset email sent successfully via Resend:', {
      id: data.id,
      to: email,
      from: useFromEmail,
    });
    return true;
  } catch (error: any) {
    const errorDetails = {
      error: error.message,
      stack: error.stack,
      name: error.name,
      to: email,
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
    };
    console.error('Error sending password reset email via Resend:', errorDetails);
    if (returnError) {
      throw error;
    }
    return false;
  }
};
