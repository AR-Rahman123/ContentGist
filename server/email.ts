import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify email configuration
export const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('Email server is ready');
    return true;
  } catch (error) {
    console.error('Email server error:', error);
    return false;
  }
};

// Send email verification
export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"ContentGist" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">ContentGist</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Welcome aboard!</p>
        </div>
        
        <div style="padding: 40px 30px; background: #f8fafc;">
          <h2 style="color: #1e293b; margin: 0 0 20px 0;">Verify Your Email Address</h2>
          <p style="color: #475569; line-height: 1.6; margin: 0 0 30px 0;">
            Thank you for signing up! Please click the button below to verify your email address and complete your registration.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: 600;
                      display: inline-block;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px; line-height: 1.5;">
            If you didn't create an account, you can safely ignore this email.<br>
            This verification link will expire in 24 hours.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="color: #64748b; font-size: 12px; text-align: center;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', email);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"ContentGist" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">ContentGist</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Password Reset Request</p>
        </div>
        
        <div style="padding: 40px 30px; background: #f8fafc;">
          <h2 style="color: #1e293b; margin: 0 0 20px 0;">Reset Your Password</h2>
          <p style="color: #475569; line-height: 1.6; margin: 0 0 30px 0;">
            You requested a password reset for your ContentGist account. Click the button below to create a new password.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: 600;
                      display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px; line-height: 1.5;">
            If you didn't request a password reset, you can safely ignore this email.<br>
            This reset link will expire in 1 hour for security reasons.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="color: #64748b; font-size: 12px; text-align: center;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', email);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};