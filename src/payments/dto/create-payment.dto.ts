import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { PaymentMethod } from '../payment.entity';

export class CreatePaymentDto {
  @IsInt()
  purchaseOrderId: number;

  @IsDateString()
  paymentDate: string;

  @IsNumber()
  amountPaid: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  notes?: string;
}
