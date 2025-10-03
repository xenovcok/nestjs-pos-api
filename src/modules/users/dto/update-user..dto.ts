import { IsEmail, IsIn, IsOptional, IsString } from "class-validator";
import { UserRole } from "src/database/entities/user.entity";

export class UpdateUserDto {
    @IsOptional() @IsString()
    name?: string;

    @IsOptional() @IsEmail()
    email?: string;

    @IsOptional() @IsString()
    password?: string;

    @IsOptional() @IsIn([UserRole.ADMIN, UserRole.KASIR, UserRole.OWNER])
    role?: UserRole;
}
