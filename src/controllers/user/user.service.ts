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

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userModel: typeof User,
  ) {}

  async getAll(): Promise<ResponseDto<User[]>> {
    const users = await this.userModel.findAll();
    return new ResponseDto<User[]>({ data: users });
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
      const existingUser = await this.userModel.findOne({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
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

      const user = await this.userModel.create({ ...createUserDto });

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

    // Ambil user terbaru setelah update
    const updatedUser = await this.userModel.findByPk(id);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found after update`);
    }

    return new ResponseDto<User>({ data: updatedUser });
  }

  async delete(id: string) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User dengan ID ${id} tidak ditemukan`);
    }

    await this.userModel.destroy({ where: { id } });

    return HttpStatus.NO_CONTENT;
  }
}
