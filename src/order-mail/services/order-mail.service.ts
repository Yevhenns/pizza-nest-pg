import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateOrderMailDto } from '../dto/create-order-mail.dto';
import * as handlebars from 'handlebars';
import { join } from 'path';
import { readFileSync } from 'fs';
import * as nodemailer from 'nodemailer';

@Injectable()
export class OrderMailService {
  private readonly logger = new Logger(OrderMailService.name);

  private readonly templatePath = join(__dirname, '../views/index.hbs');

  private loadTemplate(): string {
    try {
      return readFileSync(this.templatePath, 'utf8');
    } catch (error) {
      this.logger.error('Error reading template file', error);
      throw error;
    }
  }

  async create(createOrderMailDto: CreateOrderMailDto): Promise<{
    success: boolean;
  }> {
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;

    if (!email || !password) {
      this.logger.error('Email or password environment variables are not set');
      throw new InternalServerErrorException('Email configuration is missing');
    }

    const templateSource = this.loadTemplate();
    const template = handlebars.compile(templateSource);

    const { name, number, address, comment, order, orderSum } =
      createOrderMailDto;

    const htmlBody = template({
      name,
      number,
      address,
      comment,
      orderSum,
      order,
    });

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password,
      },
    });

    try {
      await transport.verify();
      await transport.sendMail({
        from: email,
        to: email,
        subject: 'Order',
        html: htmlBody,
      });

      return { success: true };
    } catch (error) {
      this.logger.error('Error sending email', error);
      throw new InternalServerErrorException('Send order failed');
    }
  }
}
