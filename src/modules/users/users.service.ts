import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../database/entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user..dto";
import * as bcrypt from 'bcrypt';

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
            throw new Error('User not found');
        }
        if (dto.password) dto.password = await bcrypt.hash(dto.password, 12);
        await this.repo.update(id, dto);
        return this.findById(id);
    }

    async delete(id: number) {
        const user = await this.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        await this.repo.remove(user);
        return user;
    }

    async findAll() {
        return this.repo.find();
    }
}