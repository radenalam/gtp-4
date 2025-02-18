import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  getAll() {
    return this.usersService.getAll();
  }

  @ApiOperation({ summary: 'Get user By Id' })
  @Get(':uuid')
  getUserById(@Param('uuid') uuid: string) {
    return this.usersService.findOne(uuid);
  }

  @ApiOperation({ summary: 'Create user' })
  @Post()
  create(@Body() CreateUserDto: CreateUserDto) {
    return this.usersService.create(CreateUserDto);
  }

  @ApiOperation({ summary: 'Edit user' })
  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(uuid, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete user' })
  @Delete(':uuid')
  delete(@Param('uuid') uuid: string) {
    return this.usersService.delete(uuid);
  }
}
