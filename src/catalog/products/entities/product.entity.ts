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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'decimal',
    nullable: false,
  })
  price: number;

  @Column({
    name: 'prom_price',
    type: 'decimal',
    nullable: false,
  })
  promPrice: number;

  @Column({
    type: 'boolean',
    nullable: false,
  })
  promotion: boolean;

  @Column({
    type: 'boolean',
    nullable: false,
  })
  vegan: boolean;

  @Column({
    type: 'boolean',
    nullable: false,
  })
  spicy: boolean;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  image: string;

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

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
