import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './controllers/user/user.module';
import { MysqlModule } from './common/modules/mysql.module';
import { AuthModule } from './controllers/auth/auth.module';
import { ProjectModule } from './controllers/project/project.module';
import { EventModule } from './controllers/event/event.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    MysqlModule,
    AuthModule,
    ProjectModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
