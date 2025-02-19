import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './controllers/user/user.module';
import { MysqlModule } from './common/modules/mysql.module';
import { AuthModule } from './controllers/auth/auth.module';
import { ProjectModule } from './controllers/project/project.module';

@Module({
  imports: [UsersModule, MysqlModule, AuthModule, ProjectModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
