const nodemailer = require("nodemailer");


const EMAIL = process.env.EMAIL;

const PASSWORD = process.env.PASSWORD;


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: EMAIL,
        pass: PASSWORD
    }
});


  async function taskAlertMailer(email,title,description) {
   
  
    const mailOptions = {
      from: EMAIL,
      to: email, 
      subject: 'Task Manager Alert',
      text: `Alert before 5 minute for task ${title} \n ${description}`
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Alert email sent successfully.');
    } catch (error) {
      console.error('Error Alert sending email: ', error);
    }
  }

  
  module.exports = taskAlertMailer;