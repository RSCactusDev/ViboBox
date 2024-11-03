import nodemailer from 'nodemailer'


export const sendEmail = async ( to: string, subject: string, text: string ) => {

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'viboboxofficial@gmail.com',
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = { 
    from: process.env.EMAIL_USER, 
    to,
    subject, 
    text, 
  };

  await transporter.sendMail(mailOptions)
};