import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  userProvider,
  userTokenProvider,
} from 'src/common/providers/model.provider';
import { UsersService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    JwtService,
    userTokenProvider,
    userProvider,
  ],
})
export class AuthModule {}
