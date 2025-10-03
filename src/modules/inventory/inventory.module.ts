import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Inventory } from "src/database/entities/inventory.entity";
import { Product } from "src/database/entities/product.entity";
import { InventoryService } from "./inventory.service";
import { InventoryController } from "./inventory.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, Product])],
  providers: [InventoryService],
  controllers: [InventoryController],
  exports: [InventoryService],
})
export class InventoryModule {}
