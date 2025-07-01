import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderMailDto } from '../dto/create-order-mail.dto';
import * as handlebars from 'handlebars';
import { join } from 'path';
import { readFileSync } from 'fs';
import * as nodemailer from 'nodemailer';
import { InjectRepository } from '@nestjs/typeorm';
import { UserOrder } from '../entities/order-mail.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '~/user/entities/user.entity';
import { CustomJwtPayload } from '~/auth/interfaces/auth.interface';

@Injectable()
export class OrderMailService {
  constructor(
    @InjectRepository(UserOrder)
    private readonly userOrdersRepository: Repository<UserOrder>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(OrderMailService.name);

  private readonly templatePath = join(__dirname, '../views/index.hbs');

  private loadTemplate(): string {
    return readFileSync(this.templatePath, 'utf8');
  }

  async create(
    req: Request,
    createOrderMailDto: CreateOrderMailDto,
  ): Promise<{
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

    const authHeader = req.headers['authorization'] as string;
    const token = authHeader?.split(' ')[1];

    try {
      if (token) {
        const payload: CustomJwtPayload = this.jwtService.decode(token);
        const existingUser = await this.userRepository.findOne({
          where: { id: payload.userId },
          relations: ['role'],
        });

        if (!existingUser) {
          this.logger.error('User not found');
          throw new NotFoundException('User not found');
        }

        const newOrder = this.userOrdersRepository.create({
          ...createOrderMailDto,
          user: existingUser,
        });

        await this.userOrdersRepository.save(newOrder);

        await transport.verify();
        await transport.sendMail({
          from: email,
          to: email,
          subject: 'Order',
          html: htmlBody,
        });
      } else {
        await transport.verify();
        await transport.sendMail({
          from: email,
          to: email,
          subject: 'Order',
          html: htmlBody,
        });
      }

      return { success: true };
    } catch (error) {
      this.logger.error('Error sending email', error);
      throw new InternalServerErrorException('Send order failed');
    }
  }
}
