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
import { ResponseDto } from 'src/common/dto/response.dto';
import { User } from 'src/common/models/users.model';

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
  getUserById(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiOperation({ summary: 'Create user' })
  @Post()
  create(@Body() CreateUserDto: CreateUserDto) {
    return this.usersService.create(CreateUserDto);
  }

  @ApiOperation({ summary: 'Edit user' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete user' })
  @Delete(':uuid')
  delete(@Param('uuid') uuid: string) {
    return this.usersService.delete(uuid);
  }
}
