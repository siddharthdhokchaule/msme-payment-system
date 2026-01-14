import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { PurchaseOrder, POStatus } from '../purchase-orders/purchase-order.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,

    @InjectRepository(PurchaseOrder)
    private poRepository: Repository<PurchaseOrder>,
  ) {}

  async createPayment(dto: CreatePaymentDto): Promise<Payment> {
    const po = await this.poRepository.findOne({
      where: { id: dto.purchaseOrderId },
    });

    if (!po) {
      throw new BadRequestException('Purchase order not found');
    }

    if (dto.amountPaid <= 0) {
      throw new BadRequestException('Payment amount must be positive');
    }

    // calculate total paid so far
    const payments = await this.paymentRepository.find({
      where: { purchaseOrder: { id: po.id } },
    });

    const totalPaid = payments.reduce(
      (sum, p) => sum + Number(p.amountPaid),
      0,
    );

    const outstanding = Number(po.totalAmount) - totalPaid;

    if (dto.amountPaid > outstanding) {
      throw new BadRequestException(
        'Payment amount exceeds outstanding balance',
      );
    }

    // generate reference number
    const today = new Date();
    const referenceNumber = `PAY-${today
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '')}-${Math.floor(Math.random() * 1000)}`;

    const payment = this.paymentRepository.create({
      referenceNumber,
      purchaseOrder: po,
      paymentDate: new Date(dto.paymentDate),
      amountPaid: dto.amountPaid,
      paymentMethod: dto.paymentMethod,
      notes: dto.notes,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // update PO status
    const newTotalPaid = totalPaid + dto.amountPaid;

    if (newTotalPaid === Number(po.totalAmount)) {
      po.status = POStatus.FULLY_PAID;
    } else {
      po.status = POStatus.PARTIALLY_PAID;
    }

    await this.poRepository.save(po);

    return savedPayment;
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find();
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
    });

    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    return payment;
  }
}
