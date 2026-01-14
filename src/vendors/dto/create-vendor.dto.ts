import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { VendorStatus } from '../vendor.entity';

export class CreateVendorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsInt()
  paymentTerms: number; // 7, 15, 30, 45, 60

  @IsOptional()
  @IsEnum(VendorStatus)
  status?: VendorStatus;
}
