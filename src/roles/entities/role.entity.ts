import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../interfaces/role.interface';

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
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date', readOnly: true })
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
