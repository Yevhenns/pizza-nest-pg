import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';
import { Supplement } from '../../supplements/entities/supplement.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('category')
export class Category {
  @ApiProperty({ description: 'Unique identifier of the category' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Name of the category', required: true })
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  name: string;

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
    description: 'Products relation',
    type: () => [Product],
  })
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @ApiProperty({
    description: 'Supplements relation',
    type: () => [Supplement],
  })
  @OneToMany(() => Supplement, (supplement) => supplement.category)
  supplements: Supplement[];
}
