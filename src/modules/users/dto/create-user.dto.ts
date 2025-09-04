import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString() @IsNotEmpty()
    name: string;

    @IsEmail() @IsNotEmpty()
    email: string;

    @IsString() @IsNotEmpty() @MinLength(6)
    password: string;

    @IsOptional() @IsIn(['admin', 'kasir', 'owner'])
    role?: 'admin' | 'kasir' | 'owner';
}