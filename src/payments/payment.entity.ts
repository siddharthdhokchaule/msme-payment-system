import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { PurchaseOrder } from '../purchase-orders/purchase-order.entity';

export enum PaymentMethod {
  CASH = 'Cash',
  CHEQUE = 'Cheque',
  NEFT = 'NEFT',
  RTGS = 'RTGS',
  UPI = 'UPI',
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  referenceNumber: string;

  @ManyToOne(() => PurchaseOrder, { eager: true })
  purchaseOrder: PurchaseOrder;

  @Column({ type: 'date' })
  paymentDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amountPaid: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}
