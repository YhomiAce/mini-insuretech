import { Table, Column, Model, DataType, HasMany, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { Product } from './product.model';

@Table({
  tableName: 'product_categories',
  timestamps: true,
})
export class ProductCategory extends Model<ProductCategory> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;

  @HasMany(() => Product)
  products: Product[];
} 