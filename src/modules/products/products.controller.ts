import { 
    Controller, 
    Get, 
    Param, 
    Post, 
    Put, 
    Delete, 
    Body, 
    ParseIntPipe, 
    UseGuards, 
    Query, 
    DefaultValuePipe } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { InventoryService } from "../inventory/inventory.service";
import { AdjustInventoryDto } from "src/database/entities/adjust-inventory.dto";

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
    constructor(
        private readonly service: ProductsService,
        private readonly inventory: InventoryService,
    ) {}

    @Get()
    findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('q') q?: string,
        @Query('categoryId') categoryId?: number,
        @Query('isActive') isActive?: string,
        @Query('sort', new DefaultValuePipe('created_at:desc')) sort?: string
    ) {
        return this.service.findAll({
            page,
            limit,
            q,
            categoryId: categoryId ? Number(categoryId) : undefined,
            isActive: typeof isActive === 'string' ? isActive === 'true' : undefined,
            sort
        });
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findById(id);
    }

    @Post()
    create(@Body() dto: CreateProductDto) {
        return this.service.create(dto);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.service.delete(id);
    }

    @Post(':id/adjust-stock')
    adjustStock(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AdjustInventoryDto,
    ) {
        return this.inventory.adjust(id, dto.change, dto.type, dto.reason);
    }
}