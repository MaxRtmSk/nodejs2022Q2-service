import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from '../schemas/user.schema';

import { CreateUserDto } from '../dto/createUser.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';

let users: User[] = [];
@Injectable()
export class UsersService {
  async findAll(): Promise<User[]> {
    return users;
  }

  async findOneById(id: string): Promise<User> {
    const user = users.find((user) => user.id === id);
    if (!user) {
      throw new HttpException(`User ${id} doesn't exist`, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const new_user: User = new User({
      id: randomUUID(),
      ...createUserDto,
      version: 1,
      createdAt: +Date.now(),
      updatedAt: +Date.now(),
    });
    users.push(new_user);
    return new_user;
  }

  async update(updateUserDto: UpdateUserDto, id: string): Promise<User> {
    const findIndexUser = users.findIndex((user) => user.id === id);
    if (findIndexUser < 0) {
      throw new HttpException(`User ${id} doesn't exist`, HttpStatus.NOT_FOUND);
    }

    if (users[findIndexUser].password === updateUserDto.oldPassword) {
      users[findIndexUser].password = updateUserDto.newPassword;
      users[findIndexUser].updatedAt = +Date.now();
      ++users[findIndexUser].version;
      const user = await this.findOneById(id);
      return user;
    } else {
      throw new HttpException(`oldPassowrd is wrong`, HttpStatus.FORBIDDEN);
    }
  }

  async delete(id: string): Promise<void> {
    await this.findOneById(id);
    users = users.filter(function (user) {
      return user.id != id;
    });
  }
}
