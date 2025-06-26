import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../categories/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('supplement')
export class Supplement {
  @ApiProperty({ description: 'Unique identifier of the supplement' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Name of the supplement', required: true })
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  name: string;

  @ApiProperty({ description: 'Price of the supplement', required: true })
  @Column({
    type: 'decimal',
    nullable: false,
  })
  price: number;

  @ApiProperty({
    description: 'Is vegan',
    required: true,
    type: 'boolean',
  })
  @Column({
    type: 'boolean',
    nullable: false,
  })
  vegan: boolean;

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
    description: 'Category relation',
    type: () => Category,
    required: true,
    nullable: false,
  })
  @ManyToOne(() => Category, (category) => category.supplements, {
    nullable: false,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
