import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Category } from "../../database/entities/category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>
    ) {}

    async findAll(params?: { page?: number; limit?: number; q?: string; sort?: string }) {
        const page = Math.max(1, params?.page ?? 1);
        const limit = Math.min(100, Math.max(1, params?.limit ?? 10));
        const qb = this.categoryRepository.createQueryBuilder('c');

        if (params?.q) {
            qb.andWhere('c.name LIKE :q', { q: `%${params.q}%` });
        }

        const sort = params?.sort ?? 'created_at:desc';
        const [sortFieldRaw, sortDirRaw] = sort.split(':');
        const sortFieldMap: Record<string, string> = {
            id: 'c.id',
            name: 'c.name',
            created_at: 'c.created_at',
            updated_at: 'c.updated_at',
        };
        const sortField = sortFieldMap[sortFieldRaw] ?? 'c.created_at';
        const sortDir = (sortDirRaw?.toLowerCase() === 'asc' ? 'ASC' : 'DESC') as 'ASC' | 'DESC';
        qb.orderBy(sortField, sortDir);

        qb.skip((page - 1) * limit).take(limit);
        const [data, total] = await qb.getManyAndCount();
        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                sort: `${sortFieldRaw ?? 'created_at'}:${sortDir.toLowerCase()}`,
                q: params?.q ?? null,
            },
        };
    }

    async findOne(id: number) {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new NotFoundException('Category not found');
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