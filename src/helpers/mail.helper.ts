import * as nodeMailer from 'nodemailer';
import { BadRequestException } from '@nestjs/common';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

interface IDataSendMail {
  mailTo: string;
  html: string;
}
export async function sendMail({
  mailTo,
  html,
}: IDataSendMail): Promise<SMTPTransport.SentMessageInfo> {

  if (!process.env.ROOT_MAIL || !process.env.ROOT_MAIL_PASSWORD) {
    throw new BadRequestException('No ROOT_MAIL or ROOT_MAIL_PASSWORD');
  }

  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: process.env.NODE_ENV === 'production',
    auth: {
      user: process.env.ROOT_MAIL,
      pass: process.env.ROOT_MAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `BTL' App study-nestjs ${process.env.ROOT_MAIL}`,
    to: mailTo,
    subject: "BTL' App study-nestjs",
    sender: 'admin',
    html: html,
  });
  return info;
}
