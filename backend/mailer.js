const nodemailer = require("nodemailer");

const jwt = require('jsonwebtoken');

const EMAIL = process.env.EMAIL;

const PASSWORD = process.env.PASSWORD;

const JWT_PASSWORD = process.env.JWT_PASSWORD;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: EMAIL,
        pass: PASSWORD
    }
});

  function generateToken(email) {
    return jwt.sign({ email }, JWT_PASSWORD, { expiresIn: '1h' });
  }

  async function sendVerificationEmail(email) {
   
    const token = generateToken(email);
  
    const mailOptions = {
      from: EMAIL,
      to: email, 
      subject: 'Email Verification',
      text: `Click the following link to verify your email: https://task-manager-0ygk.onrender.com/verify/?token=${token}` // Email body with verification link
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Verification email sent successfully.');
    } catch (error) {
      console.error('Error sending verification email: ', error);
    }
  }

  
  module.exports = sendVerificationEmail;