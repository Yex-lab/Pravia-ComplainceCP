import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LocalDatabaseModule } from '../../database/database.module';

import { IsExist } from './is-exist.validator';
import { IsNotExist } from './is-not-exist.validator';

@Module({
  imports: [TypeOrmModule, LocalDatabaseModule],
  providers: [IsExist, IsNotExist],
  exports: [IsExist, IsNotExist],
})
export class ValidatorsModule {}
