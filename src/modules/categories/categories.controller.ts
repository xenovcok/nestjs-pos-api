import { Controller, Get, Param, Post, Body, Put, Delete } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Controller('categories')
export class CategoriesController {
    constructor(private readonly service: CategoriesService) {}

    @Get()
    async findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.service.findOne(id);
    }

    @Post()
    async create(@Body() category: CreateCategoryDto) {
        return this.service.create(category);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() category: UpdateCategoryDto) {
        return this.service.update(id, category);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.service.delete(id);
    }
}