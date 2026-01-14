import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './vendor.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
  ) {}

  // CREATE vendor
  async createVendor(createVendorDto: CreateVendorDto): Promise<Vendor> {
    const existingVendor = await this.vendorRepository.findOne({
      where: [
        { name: createVendorDto.name },
        { email: createVendorDto.email },
      ],
    });

    if (existingVendor) {
      throw new ConflictException('Vendor name or email already exists');
    }

    const vendor = this.vendorRepository.create(createVendorDto);
    return this.vendorRepository.save(vendor);
  }

  // GET all vendors
  async findAll(): Promise<Vendor[]> {
    return this.vendorRepository.find();
  }
}
