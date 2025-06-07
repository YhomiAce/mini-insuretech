import { Table, Column, Model, DataType, BelongsTo, ForeignKey, HasMany, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { ProductCategory } from './product-category.model';
import { Policy } from './policy.model';
import { Plan } from './plan.model';


@Table({
  tableName: 'products',
  timestamps: true,
})
export class Product extends Model<Product> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;

  @ForeignKey(() => ProductCategory)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  categoryId: number;

  @BelongsTo(() => ProductCategory)
  category: ProductCategory;

  @HasMany(() => Plan)
  plans: Plan[];

  @HasMany(() => Policy)
  policies: Policy[];
} 