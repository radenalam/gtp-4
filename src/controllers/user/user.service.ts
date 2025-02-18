import {
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/common/models/users.model';
import { ResponseDto } from 'src/common/dto/response.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userModel: typeof User,
  ) {}

  async getAll(
    page: number = 1,
    size: number = 10,
  ): Promise<ResponseDto<User[]>> {
    const offset = (page - 1) * size;
    const { rows: users, count } = await this.userModel.findAndCountAll({
      limit: size,
      offset: offset,
    });
    const meta = new PaginationDto({
      page,
      size,
      totalItems: count,
    });
    return new ResponseDto<User[]>({ data: users, pagination: meta });
  }

  async findOne(id: number): Promise<ResponseDto<User>> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new ResponseDto<User>({ data: user });
  }

  async create(createUserDto: CreateUserDto): Promise<ResponseDto<User>> {
    try {
      const existingEmail = await this.userModel.findOne({
        where: { email: createUserDto.email },
      });
      if (existingEmail) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }

      const existingUsername = await this.userModel.findOne({
        where: { username: createUserDto.username },
      });
      if (existingUsername) {
        throw new HttpException('Username already exists', HttpStatus.CONFLICT);
      }

      const existingPhone = await this.userModel.findOne({
        where: { phone_number: createUserDto.phone_number },
      });
      if (existingPhone) {
        throw new HttpException(
          'Phone number already exists',
          HttpStatus.CONFLICT,
        );
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = await this.userModel.create({
        ...createUserDto,
        password: hashedPassword,
      });

      return new ResponseDto<User>({ data: user });
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred while creating the user',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseDto<User>> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User dengan ID ${id} tidak ditemukan`);
    }

    await this.userModel.update(updateUserDto, { where: { id } });

    const updatedUser = await this.userModel.findByPk(id);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found after update`);
    }

    return new ResponseDto<User>({ data: updatedUser });
  }

  async delete(id: number) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User dengan ID ${id} tidak ditemukan`);
    }

    await this.userModel.destroy({ where: { id } });

    return HttpStatus.NO_CONTENT;
  }
}
