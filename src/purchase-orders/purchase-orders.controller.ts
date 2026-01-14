import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { PurchaseOrder } from './purchase-order.entity';

@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly poService: PurchaseOrdersService) {}

  // POST /purchase-orders
  @Post()
  async create(
    @Body() dto: CreatePurchaseOrderDto,
  ): Promise<PurchaseOrder> {
    return this.poService.createPO(dto);
  }

  // GET /purchase-orders
  @Get()
  async findAll(): Promise<PurchaseOrder[]> {
    return this.poService.findAll();
  }

  // GET /purchase-orders/:id
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PurchaseOrder> {
    return this.poService.findOne(Number(id));
  }
}
