import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards, ParseIntPipe, Query, DefaultValuePipe } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
    constructor(private readonly service: CategoriesService) {}

    @Get()
    async findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('q') q?: string,
        @Query('sort', new DefaultValuePipe('created_at:desc')) sort?: string,
    ) {
        return this.service.findAll({ page, limit, q, sort });
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

    @Post()
    async create(@Body() category: CreateCategoryDto) {
        return this.service.create(category);
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() category: UpdateCategoryDto) {
        return this.service.update(id, category);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.service.delete(id);
    }
}