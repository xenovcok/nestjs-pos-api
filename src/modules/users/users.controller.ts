import { Controller, Get, Param, Post, Put, Delete, Body } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user..dto";

@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) {}

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.service.findById(id);
    }

    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.service.create(dto);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.service.delete(id);
    }
}