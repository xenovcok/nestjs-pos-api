import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "../../database/entities/category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>
    ) {}

    async findAll() {
        return await this.categoryRepository.find();
    }

    async findOne(id: number) {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new Error('Category not found');
        }
        return category;
    }

    async create(category: CreateCategoryDto) {
        return await this.categoryRepository.save(category);
    }

    async update(id: number, category: UpdateCategoryDto) {
        await this.categoryRepository.update(id, category);
        return await this.findOne(id);
    }

    async delete(id: number) {
        const category = await this.findOne(id);
        await this.categoryRepository.remove(category);
        return category;
    }
}