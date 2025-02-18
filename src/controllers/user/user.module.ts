import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { userProvider } from 'src/common/providers/model.provider';

@Module({
  imports: [],
  providers: [UsersService, userProvider],
  controllers: [UsersController],
})
export class UsersModule {}
