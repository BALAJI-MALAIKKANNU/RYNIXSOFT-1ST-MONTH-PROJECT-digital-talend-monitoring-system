const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

exports.sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: 'DTMS - Password Reset OTP',
    text: `Your OTP for password reset is ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset</h2>
        <p>Your OTP for resetting your password in the Digital Talent Management System is:</p>
        <h3 style="color: #378ADD; letter-spacing: 2px;">${otp}</h3>
        <p>It will expire in 10 minutes.</p>
      </div>
    `
  };

  try {
    if (process.env.GMAIL_USER && !process.env.GMAIL_USER.includes('your@gmail')) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log(`[MOCK EMAIL] To: ${to}, OTP: ${otp}`);
    }
  } catch (err) {
    console.error('Error sending email:', err);
    throw new Error('Failed to send email');
  }
};
