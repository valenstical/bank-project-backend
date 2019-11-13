import mailer from 'nodemailer';

export class Mailer {
  static send(email, subject, message) {
    const smtp = {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    };
    const content = {
      from: process.env.EMAIL_USERNAME,
      replyTo: process.env.EMAIL_USERNAME,
      to: email,
      subject,
      text: message,
    };
    const transport = mailer.createTransport(smtp);
    transport.sendMail(content, e => {});
  }
}

export default {};
