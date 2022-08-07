import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
// import { User, Prisma } from '@prisma/client';

import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserDto } from '../dto/createUser.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({});
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id } });
    return new User(user);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hash = await this.hashData(createUserDto.password);
    const user = await this.prisma.user.create({
      data: { ...createUserDto, password: hash, version: 1 },
    });

    return new User(user);
  }

  findByLogin(login: string): Promise<User | undefined> {
    return this.prisma.user.findFirst({ where: { login } });
  }

  async update(updateUserDto: UpdateUserDto, id: string): Promise<User> {
    const user = await this.prisma.user
      .findUniqueOrThrow({ where: { id } })
      .catch(() => {
        throw new HttpException(
          `User ${id} doesn't exist`,
          HttpStatus.NOT_FOUND,
        );
      });

    if (user.password !== updateUserDto.oldPassword)
      throw new HttpException(`oldPassowrd is wrong`, HttpStatus.FORBIDDEN);

    const updated_user = await this.prisma.user.update({
      where: { id },
      data: {
        password: updateUserDto.newPassword,
        version: (user.version += 1),
        updatedAt: new Date(),
      },
    });

    return new User(updated_user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.findUniqueOrThrow({ where: { id } }).catch(() => {
      throw new HttpException(`User ${id} doesn't exist`, HttpStatus.NOT_FOUND);
    });
    await this.prisma.user.delete({ where: { id } });
  }
}
