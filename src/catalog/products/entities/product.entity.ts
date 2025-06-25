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

@Entity('product')
export class Product {
  @ApiProperty({ description: 'Unique identifier of the product' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Name of the product', required: true })
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  name: string;

  @ApiProperty({ description: 'Price of the product', required: true })
  @Column({
    type: 'decimal',
    nullable: false,
  })
  price: number;

  @ApiProperty({
    description: 'Promotion price of the product',
    required: true,
  })
  @Column({
    name: 'prom_price',
    type: 'decimal',
    nullable: false,
  })
  PromPrice: number;

  @ApiProperty({
    description: 'Is promotion',
    required: true,
    type: 'boolean',
  })
  @Column({
    type: 'boolean',
    nullable: false,
  })
  promotion: boolean;

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

  @ApiProperty({
    description: 'Is spicy',
    required: true,
    type: 'boolean',
  })
  @Column({
    type: 'boolean',
    nullable: false,
  })
  spicy: boolean;

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
  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
