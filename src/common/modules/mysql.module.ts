import { Module } from '@nestjs/common';
import { mysqlProvider } from '../providers/mysql.provider';

@Module({
  providers: [mysqlProvider],
  exports: [mysqlProvider],
})
export class MysqlModule {}
