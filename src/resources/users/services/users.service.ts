import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from '../schemas/user.schema';
// import { User, Prisma } from '@prisma/client';

import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserDto } from '../dto/createUser.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';

let users: User[] = [];
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({});
  }

  async findOneById(id: string): Promise<User> {
    const user = users.find((user) => user.id === id);
    if (!user) {
      throw new HttpException(`User ${id} doesn't exist`, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<void> {
    console.log(createUserDto);
    // const new_user: User = new User({
    //   id: randomUUID(),
    //   ...createUserDto,
    //   version: 1,
    //   createdAt: +Date.now(),
    //   updatedAt: +Date.now(),
    // });
    // users.push(new_user);
    // return new_user;
  }

  async update(updateUserDto: UpdateUserDto, id: string): Promise<User> {
    const findIndexUser = users.findIndex((user) => user.id === id);
    if (findIndexUser < 0) {
      throw new HttpException(`User ${id} doesn't exist`, HttpStatus.NOT_FOUND);
    }

    if (users[findIndexUser].password !== updateUserDto.oldPassword)
      throw new HttpException(`oldPassowrd is wrong`, HttpStatus.FORBIDDEN);

    const user = users[findIndexUser];

    user.password = updateUserDto.newPassword;
    user.version += 1;

    const find_user = await this.findOneById(id);
    return find_user;
  }

  async delete(id: string): Promise<void> {
    await this.findOneById(id);

    users = users.filter(function (user) {
      return user.id != id;
    });
  }
}
