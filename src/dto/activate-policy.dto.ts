import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActivatePolicyDto {
  @ApiProperty({
    description: 'User ID who is activating the policy',
    example: 1,
    type: 'number',
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'Optional description for the policy activation',
    example: 'Activate health insurance policy',
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
