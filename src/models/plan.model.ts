import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  HasMany,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Product } from './product.model';
import { PendingPolicy } from './pending-policy.model';

@Table({
  tableName: 'plans',
  timestamps: true,
})
export class Plan extends Model<Plan> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  productId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('totalAmount');
      return rawValue ? +rawValue : 0;
    },
  })
  totalAmount: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Product)
  product: Product;

  @HasMany(() => PendingPolicy)
  pendingPolicies: PendingPolicy[];
}
