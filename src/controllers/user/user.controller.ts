import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { UserGuard } from './guard/user.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
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
  @Get(':user_id')
  getUserById(@Param('user_id') user_id: number) {
    return this.usersService.findOne(+user_id);
  }

  @ApiOperation({ summary: 'Create user' })
  @Post()
  create(@Body() CreateUserDto: CreateUserDto) {
    return this.usersService.create(CreateUserDto);
  }

  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Edit user' })
  @Patch(':user_id')
  update(
    @Param('user_id') user_id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+user_id, updateUserDto);
  }

  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Delete user' })
  @Delete(':user_id')
  delete(@Param('user_id') user_id: number, @Request() req) {
    return this.usersService.delete(+user_id);
  }
}
