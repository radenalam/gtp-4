import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  HttpStatus,
  HttpException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UsersService } from 'src/controllers/user/user.service';
import { ResponseDto } from 'src/common/dto/response.dto';
import { User } from 'src/common/models/users.model';
import { UserToken } from 'src/common/models/user-token.model';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userModel: typeof User,
    @Inject('USER_TOKEN_REPOSITORY')
    private readonly userTokenModel: typeof UserToken,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const existingEmail = await this.userModel.findOne({
        where: { email: registerDto.email },
      });
      if (existingEmail) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }

      const existingUsername = await this.userModel.findOne({
        where: { username: registerDto.username },
      });
      if (existingUsername) {
        throw new HttpException('Username already exists', HttpStatus.CONFLICT);
      }

      const existingPhone = await this.userModel.findOne({
        where: { phone_number: registerDto.phone_number },
      });
      if (existingPhone) {
        throw new HttpException(
          'Phone number already exists',
          HttpStatus.CONFLICT,
        );
      }

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const user = await this.userModel.create({
        ...registerDto,
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

  async login(loginDto: LoginDto): Promise<ResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    await this.userTokenModel.create({ user_id: user.id, token });

    return new ResponseDto({ data: { accesToken: token } });
  }
}
