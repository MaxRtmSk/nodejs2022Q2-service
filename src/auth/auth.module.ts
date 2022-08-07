import { Module } from '@nestjs/common';
import { UsersModule } from 'src/resources/users/users.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AtStrategy, RtStrategy } from './strategies';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({}), PrismaModule],
  providers: [AuthService],
  exports: [AuthService, AtStrategy, RtStrategy],
})
export class AuthModule {}
