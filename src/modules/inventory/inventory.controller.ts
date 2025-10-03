import { Controller, Get, Query, DefaultValuePipe, ParseIntPipe, UseGuards, Post, Param, Body } from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { AdjustInventoryDto } from "src/database/entities/adjust-inventory.dto";

@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventory: InventoryService) {}

  @Get()
  history(
    @Query('productId') productId?: number,
    @Query('type') type?: 'in' | 'out',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    return this.inventory.history({ productId: productId ? Number(productId) : undefined, type, page, limit });
  }
}
