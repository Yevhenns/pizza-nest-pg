import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../interfaces/role.interface';
import { User } from '../../auth/entities/auth.entity';

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

  @ApiProperty({
    description: 'User relation',
    type: () => [User],
    required: true,
    nullable: false,
  })
  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
