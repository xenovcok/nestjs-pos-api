import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user..dto";
import * as bcrypt from 'bcrypt';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../database/entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

    findById(id: number) {
        return this.repo.findOne({ where: { id } });
    }

    findByEmail(email: string) {
        return this.repo.findOne({ where: { email } });
    }

    findByEmailWithPassword(email: string) {
        return this.repo.findOne({ where: { email }, select: ['id', 'name', 'email', 'password', 'role'] });
    }

    async create(dto: CreateUserDto) {
        const user = this.repo.create(dto);
        return this.repo.save(user);
    }

    async update(id: number, dto: UpdateUserDto) {
        const user = await this.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (dto.password) dto.password = await bcrypt.hash(dto.password, 12);
        await this.repo.update(id, dto);
        return this.findById(id);
    }

    async delete(id: number) {
        const user = await this.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        await this.repo.remove(user);
        return user;
    }

    async findAll(params?: { page?: number; limit?: number; q?: string; role?: string; sort?: string }) {
        const page = Math.max(1, params?.page ?? 1);
        const limit = Math.min(100, Math.max(1, params?.limit ?? 10));
        const qb = this.repo.createQueryBuilder('u');

        if (params?.q) {
            qb.andWhere('(u.name LIKE :q OR u.email LIKE :q)', { q: `%${params.q}%` });
        }
        if (params?.role) {
            qb.andWhere('u.role = :role', { role: params.role });
        }

        const sort = params?.sort ?? 'created_at:desc';
        const [sortFieldRaw, sortDirRaw] = sort.split(':');
        const sortFieldMap: Record<string, string> = {
            id: 'u.id',
            name: 'u.name',
            email: 'u.email',
            created_at: 'u.created_at',
            updated_at: 'u.updated_at',
        };
        const sortField = sortFieldMap[sortFieldRaw] ?? 'u.created_at';
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
                role: params?.role ?? null,
            },
        };
    }
}