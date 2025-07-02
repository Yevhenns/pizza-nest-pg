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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  phone: string;

  @Column({
    type: 'varchar',
    length: 255,
    default:
      'https://res.cloudinary.com/dyka4vajb/image/upload/f_auto,q_auto/v1/hatamagnata/other/qnzdjcor4opcy0kpkb4o',
  })
  avatar: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @Column({
    name: 'verification_token',
    type: 'varchar',
    default: null,
    nullable: true,
  })
  verificationToken?: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => Role, (role) => role.users, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToMany(() => UserOrder, (userOrder) => userOrder.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  userOrders: UserOrder[];
}
