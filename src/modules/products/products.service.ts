import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "../../database/entities/product.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { InventoryService } from "../inventory/inventory.service";

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product) private readonly repo: Repository<Product>,
        private readonly inventory: InventoryService,
    ) {}

    async create(dto: CreateProductDto) {
        const product = this.repo.create(dto);
        return this.repo.save(product);
    }

    async findAll(params?: {
        page?: number;
        limit?: number;
        q?: string;
        categoryId?: number;
        isActive?: boolean;
        sort?: string; // e.g. "created_at:desc"
    }) {
        const page = Math.max(1, params?.page ?? 1);
        const limit = Math.min(100, Math.max(1, params?.limit ?? 10));
        const qb = this.repo.createQueryBuilder('p')
            .leftJoinAndSelect('p.category', 'c');

        if (params?.q) {
            qb.andWhere('(p.name LIKE :q OR p.sku LIKE :q)', { q: `%${params.q}%` });
        }
        if (typeof params?.categoryId === 'number') {
            qb.andWhere('c.id = :categoryId', { categoryId: params.categoryId });
        }
        if (typeof params?.isActive === 'boolean') {
            qb.andWhere('p.is_active = :isActive', { isActive: params.isActive });
        }

        const sort = params?.sort ?? 'created_at:desc';
        const [sortFieldRaw, sortDirRaw] = sort.split(':');
        const sortFieldMap: Record<string, string> = {
            id: 'p.id',
            name: 'p.name',
            price: 'p.price',
            created_at: 'p.created_at',
            updated_at: 'p.updated_at',
            sku: 'p.sku',
        };
        const sortField = sortFieldMap[sortFieldRaw] ?? 'p.created_at';
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
                categoryId: params?.categoryId ?? null,
                isActive: typeof params?.isActive === 'boolean' ? params.isActive : null,
            },
        };
    }

    async findById(id: number) {
        return this.repo.findOne({ where: { id } });
    }

    async update(id: number, dto: UpdateProductDto) {
        const product = await this.findById(id);
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (dto.stock != null && dto.stock < 0) {
            throw new BadRequestException('Stock cannot be negative');
        }

        const { stock: desiredStock, ...rest } = dto as any;

        if (Object.keys(rest).length > 0) {
            await this.repo.update(id, rest);
        }

        return this.findById(id);
    }

    async delete(id: number) {
        const product = await this.findById(id);
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        await this.repo.remove(product);
        return product;
    }
}