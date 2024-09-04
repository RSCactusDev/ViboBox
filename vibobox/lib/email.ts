import nodemailer from 'nodemailer';


export async function sendVerificationEmail(email: string, verificationToken: string) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'viboboxofficial@gmail.com',
      pass: process.env.EMAIL_PASS,
    },
  });


  const vertificationLink = `${process.env.PUBLIC_URL}/verify-email?token=${verificationToken}`;
  
  await transporter.sendMail({
    from: 'viboboxofficial@gmail.com',
    to: email,
    subject: 'ViboBox - Email Verification',
    html: `
      <p>Please click the following link to verify your email:</p>
      <a href="${vertificationLink}">Verify Email</a>
    `,
  });
}
