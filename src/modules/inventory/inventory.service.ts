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

  async adjust(productId: number, changeAbs: number, type: 'in' | 'out', reason?: string) {
    if (changeAbs <= 0) throw new BadRequestException('change must be > 0');

    return this.invRepo.manager.transaction(async (manager) => {
      const product = await manager.getRepository(Product).findOne({ where: { id: productId } });
      if (!product) throw new NotFoundException('Product not found');

      const delta = type === 'in' ? changeAbs : -changeAbs;
      const newStock = (product.stock ?? 0) + delta;
      if (newStock < 0) {
        throw new BadRequestException('Insufficient stock');
      }

      // save inventory movement
      const movement = manager.getRepository(Inventory).create({
        product_id: productId,
        change: Math.abs(changeAbs),
        type,
      } as any);
      await manager.getRepository(Inventory).save(movement);

      // update product stock
      await manager.getRepository(Product).update(productId, { stock: newStock });

      return { movement, product: { ...product, stock: newStock } };
    });
  }

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