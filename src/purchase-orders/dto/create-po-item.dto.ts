import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePOItemDto {
  @IsNotEmpty()
  description: string;

  @IsInt()
  quantity: number;

  @IsNumber()
  unitPrice: number;
}
