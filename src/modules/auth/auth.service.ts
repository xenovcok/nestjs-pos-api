import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from 'bcrypt';
import { User } from "../../database/entities/user.entity";

@Injectable()
export class AuthService {
    constructor(private users: UsersService, private jwt: JwtService) {}

    async register(dto: RegisterDto) {
        const user = await this.users.create(dto);
        return this.signToken(user);
    }

    async login(dto: LoginDto) {
        const user = await this.users.findByEmailWithPassword(dto.email);
        if (!user) throw new UnauthorizedException('Invalid credentials');
        const ok = await bcrypt.compare(dto.password, user.password);
        if (!ok) throw new UnauthorizedException('Invalid credentials');
        return this.signToken(user);
    }

    private signToken(user: User) {
        const payload = { sub: user.id, email: user.email, name: user.name, role: user.role };
        return {
            access_token: this.jwt.sign(payload),
        };
    }
}
