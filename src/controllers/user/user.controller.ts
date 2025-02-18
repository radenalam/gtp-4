import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  async getUsers(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ) {
    return this.usersService.getAll(+page, +size);
  }

  @ApiOperation({ summary: 'Get user By Id' })
  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.usersService.findOne(+id);
  }

  @ApiOperation({ summary: 'Create user' })
  @Post()
  create(@Body() CreateUserDto: CreateUserDto) {
    return this.usersService.create(CreateUserDto);
  }

  @ApiOperation({ summary: 'Edit user' })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete user' })
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.usersService.delete(+id);
  }
}
