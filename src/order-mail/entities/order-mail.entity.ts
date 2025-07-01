import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '~/user/entities/user.entity';

@Entity('user_orders')
export class UserOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ length: 200 })
  number: string;

  @Column({ length: 200, nullable: true })
  address?: string;

  @Column({ length: 200, nullable: true })
  comment?: string;

  @ApiProperty({
    description: 'User relation',
    type: () => User,
    required: true,
    nullable: false,
  })
  @ManyToOne(() => User, (user) => user.userOrders, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'jsonb' })
  order: {
    title: string;
    quantity: number;
    optionsTitles?: string[];
  }[];

  @Column({ type: 'int' })
  orderSum: number;

  @CreateDateColumn()
  createdAt: Date;
}
