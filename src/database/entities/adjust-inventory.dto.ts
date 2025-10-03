import { IsIn, IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class AdjustInventoryDto {
  @IsInt()
  @IsPositive()
  change: number; // absolute value of movement

  @IsIn(['in', 'out'])
  type: 'in' | 'out';

  @IsOptional()
  @IsNotEmpty()
  reason?: string;
}