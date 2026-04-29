import nodemailer from 'nodemailer';
import config from '../config/config.js'

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // type: 'OAuth2',
    user: config.GOOGLE_USER,
    pass: config.GMAIL_PASSWORD
    // clientId: config.GOOGLE_CLIENT_ID,
    // clientSecret: config.GOOGLE_CLIENT_SECRET,
    // refreshToken: config.GOOGLE_REFRESH_TOKEN
  },
  connectionTimeout: 10000
})

transporter.verify((error, success) => {
  if (error) {
    console.log('Error setting up email transporter', error);
  } else {
    console.log('Email transporter is ready');
  }
})


export const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"BiteFlix" <${config.GOOGLE_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
