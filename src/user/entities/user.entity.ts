import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/entities/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserOrder } from '~/order-mail/entities/order-mail.entity';

@Entity('user')
export class User {
  @ApiProperty({ description: 'Unique identifier of the user' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'User name', required: true })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({ description: 'User email', required: true })
  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @ApiProperty({ description: 'User password', required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  password: string;

  @ApiProperty({ description: 'User phone number', required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  phone: string;

  @ApiProperty({ description: 'User photo', required: true })
  @Column({
    type: 'varchar',
    length: 255,
    default:
      'https://res.cloudinary.com/dyka4vajb/image/upload/f_auto,q_auto/v1/hatamagnata/other/qnzdjcor4opcy0kpkb4o',
  })
  avatar: string;

  @ApiProperty({ description: 'Is user verified', default: false })
  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @ApiProperty({ description: 'User verification token', default: null })
  @Column({
    name: 'verification_token',
    type: 'varchar',
    default: null,
    nullable: true,
  })
  verificationToken?: string | null;

  @ApiProperty({ description: 'Creation date', readOnly: true })
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date', readOnly: true })
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Role relation',
    type: () => Role,
    required: true,
    nullable: false,
  })
  @ManyToOne(() => Role, (role) => role.users, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ApiProperty({
    description: 'User orders relation',
    type: () => [UserOrder],
  })
  @OneToMany(() => UserOrder, (userOrder) => userOrder.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  userOrders: UserOrder[];
}
