import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Inventory } from "src/database/entities/inventory.entity";
import { Product } from "src/database/entities/product.entity";

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory) private readonly invRepo: Repository<Inventory>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
  ) {}

  async history(params?: { productId?: number; type?: 'in' | 'out'; page?: number; limit?: number }) {
    const page = Math.max(1, params?.page ?? 1);
    const limit = Math.min(100, Math.max(1, params?.limit ?? 10));
    const qb = this.invRepo.createQueryBuilder('i');

    if (typeof params?.productId === 'number') {
      qb.andWhere('i.product_id = :pid', { pid: params.productId });
    }
    if (params?.type === 'in' || params?.type === 'out') {
      qb.andWhere('i.type = :type', { type: params.type });
    }

    qb.orderBy('i.created_at', 'DESC');
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}