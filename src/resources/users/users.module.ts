import { UsersController } from './users.controller';
import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
