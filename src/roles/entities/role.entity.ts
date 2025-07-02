import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../interfaces/role.interface';
import { User } from '~/user/entities/user.entity';

@Entity('role')
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

export class RoleWithoutUsersDto extends OmitType(Role, ['users'] as const) {}
