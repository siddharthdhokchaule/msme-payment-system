import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment } from './payment.entity';
import { PurchaseOrder } from '../purchase-orders/purchase-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, PurchaseOrder])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
