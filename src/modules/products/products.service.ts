import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "../../database/entities/product.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
    constructor(@InjectRepository(Product) private readonly repo: Repository<Product>) {}

    async create(dto: CreateProductDto) {
        const product = this.repo.create(dto);
        return this.repo.save(product);
    }

    async findAll() {
        return this.repo.find();
    }

    async findById(id: number) {
        return this.repo.findOne({ where: { id } });
    }

    async update(id: number, dto: UpdateProductDto) {
        const product = await this.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        await this.repo.update(id, dto);
        return this.findById(id);
    }

    async delete(id: number) {
        const product = await this.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        await this.repo.remove(product);
        return product;
    }
}