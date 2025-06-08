import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { Plan } from './plan.model';

export enum PendingPolicyStatus {
  UNUSED = 'unused',
  USED = 'used',
}

@Table({
  tableName: 'pending_policies',
  timestamps: true,
  paranoid: true, // Enables soft delete
})
export class PendingPolicy extends Model<PendingPolicy> {
  @ForeignKey(() => Plan)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  planId: number;

  @Column({
    type: DataType.ENUM(...Object.values(PendingPolicyStatus)),
    allowNull: false,
    defaultValue: PendingPolicyStatus.UNUSED,
  })
  status: PendingPolicyStatus;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;

  @BelongsTo(() => Plan)
  plan: Plan;
}
