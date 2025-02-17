import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  getAll() {
    return 'This action returns all users';
  }

  findOne(uuid: string) {
    return `This action returns a #${uuid} user`;
  }

  create(CreateUserDto: CreateUserDto) {
    return CreateUserDto;
  }

  update(uuid: string, updateUserDto: UpdateUserDto) {
    return {
      ...updateUserDto,
      uuid,
    };
  }

  delete(uuid: string) {
    return `User #${uuid} deleted`;
  }
}
