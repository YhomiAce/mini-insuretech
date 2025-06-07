import { Table, Column, Model, DataType, BelongsTo, ForeignKey, PrimaryKey, AutoIncrement, BeforeCreate } from 'sequelize-typescript';
import { User } from './user.model';
import { Product } from './product.model';
import { Plan } from './plan.model';
import { PendingPolicy } from './pending-policy.model';

@Table({
  tableName: 'policies',
  timestamps: true,
})
export class Policy extends Model<Policy> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  policyNumber: string;

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

  @ForeignKey(() => PendingPolicy)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  pendingPolicyId: number;



  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Product)
  product: Product;

  @BelongsTo(() => PendingPolicy)
  pendingPolicy: PendingPolicy;

  @BeforeCreate
  static generatePolicyNumber(instance: Policy) {
    // Generate a unique policy number
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    instance.policyNumber = `POL-${timestamp}-${random}`;
  }
} 