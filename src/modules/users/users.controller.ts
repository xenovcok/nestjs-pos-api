import { Controller, Get, Param, Post, Put, Delete, Body, UseGuards, ParseIntPipe, Query, DefaultValuePipe } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user..dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly service: UsersService) {}

    @Get()
    findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('q') q?: string,
        @Query('role') role?: string,
        @Query('sort', new DefaultValuePipe('created_at:desc')) sort?: string,
    ) {
        return this.service.findAll({ page, limit, q, role, sort });
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findById(id);
    }

    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.service.create(dto);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.service.delete(id);
    }
}