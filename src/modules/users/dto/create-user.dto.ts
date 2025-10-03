import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { UserRole } from "src/database/entities/user.entity";

export class CreateUserDto {
    @IsString() @IsNotEmpty()
    name: string;

    @IsEmail() @IsNotEmpty()
    email: string;

    @IsString() @IsNotEmpty() @MinLength(6)
    password: string;

    @IsOptional() @IsIn([UserRole.ADMIN, UserRole.KASIR, UserRole.OWNER])
    role?: UserRole;
}