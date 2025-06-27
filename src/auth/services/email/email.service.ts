import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;
  private baseUrl = process.env.BASE_URL;
  private email = process.env.EMAIL;
  private password = process.env.PASSWORD;

  constructor() {
    if (!this.email || !this.password) {
      throw new Error(
        'EMAIL or PASSWORD is not defined in environment variables',
      );
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.email,
        pass: this.password,
      },
    });
  }

  async sendVerifyEmail(userEmail: string, token: string) {
    const mailOptions = {
      from: this.email,
      to: userEmail,
      subject: 'Email Confirmation',
      html: `<p>To confirm your email, please <a href="${this.baseUrl}/api/verify/${token}">click here</a>.</p>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      this.logger.error('Failed to send verification email', error);
      throw new Error('Email sending failed');
    }
  }
}
