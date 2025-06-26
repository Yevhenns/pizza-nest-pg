import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column({ length: 200, nullable: true })
  userId?: string;

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
