import { Controller, Post, Body, Get } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { Vendor } from './vendor.entity';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  // POST /vendors
  @Post()
  async createVendor(
    @Body() createVendorDto: CreateVendorDto,
  ): Promise<Vendor> {
    return this.vendorsService.createVendor(createVendorDto);
  }

  // GET /vendors
  @Get()
  async getAllVendors(): Promise<Vendor[]> {
    return this.vendorsService.findAll();
  }
}
