import nodemailer from 'nodemailer';
import config from '../config/config.js'

const authOptions = config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET && config.GOOGLE_REFRESH_TOKEN
    ? {
        type: 'OAuth2',
        user: config.GOOGLE_USER,
        clientId: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        refreshToken: config.GOOGLE_REFRESH_TOKEN
    }
    : {
        user: config.GOOGLE_USER,
        pass: config.GMAIL_PASSWORD
    };

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: authOptions
});

transporter.verify((error, success) => {
    if(error){
        console.log('Error setting up email transporter', error);
    } else {
        console.log('Email transporter is ready');
    }
})


export const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Name" <${config.GOOGLE_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
