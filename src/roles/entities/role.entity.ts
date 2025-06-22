import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../interfaces/role.interface';
import { User } from 'src/auth/entities/auth.entity';

@Entity('roles')
export class Role {
  @ApiProperty({ description: 'Unique identifier of the user role' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Name of the user role', required: true })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
    unique: true,
  })
  name: string;

  @ApiProperty({ description: 'Description of the user role', required: true })
  @Column({ type: 'varchar', length: 100 })
  description: string;

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
    description: 'User relation',
    type: () => [User],
    required: true,
    nullable: false,
  })
  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
