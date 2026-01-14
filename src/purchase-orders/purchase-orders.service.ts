import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder, POStatus } from './purchase-order.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';
import { Vendor, VendorStatus } from '../vendors/vendor.entity';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private poRepository: Repository<PurchaseOrder>,

    @InjectRepository(PurchaseOrderItem)
    private itemRepository: Repository<PurchaseOrderItem>,

    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
  ) {}

  async createPO(dto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    const vendor = await this.vendorRepository.findOne({
      where: { id: dto.vendorId },
    });

    if (!vendor) {
      throw new BadRequestException('Vendor not found');
    }

    if (vendor.status === VendorStatus.INACTIVE) {
      throw new BadRequestException('Cannot create PO for inactive vendor');
    }

    // calculate total
    const totalAmount = dto.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    // due date = poDate + payment terms
    const dueDate = new Date(dto.poDate);
    dueDate.setDate(dueDate.getDate() + vendor.paymentTerms);

    // PO number
    const today = new Date();
    const poNumber = `PO-${today
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '')}-${Math.floor(Math.random() * 1000)}`;

    const po = this.poRepository.create({
      poNumber,
      vendor,
      poDate: new Date(dto.poDate),
      totalAmount,
      dueDate,
      status: POStatus.APPROVED,
    });

    const savedPO = await this.poRepository.save(po);

    const items = dto.items.map((i) =>
      this.itemRepository.create({
        ...i,
        purchaseOrder: savedPO,
      }),
    );

    await this.itemRepository.save(items);

    return savedPO;
  }
    // GET all purchase orders (basic list)
  async findAll(): Promise<PurchaseOrder[]> {
    return this.poRepository.find({
      relations: ['items', 'vendor'],
      order: { createdAt: 'DESC' },
    });
  }

  // GET purchase order by ID
  async findOne(id: number): Promise<PurchaseOrder> {
    const po = await this.poRepository.findOne({
      where: { id },
      relations: ['items', 'vendor'],
    });

    if (!po) {
      throw new Error('Purchase order not found');
    }

    return po;
  }
}
