/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
const bcrypt = require('bcryptjs');

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(createUserdto: CreateUserDto) {
    const userAlreadyExists = await this.checkIfUserExists(createUserdto);
    if (userAlreadyExists) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'User already exists' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await this.hashPassword(createUserdto.password);

    const user = await this.userRepository.create({
      ...createUserdto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    return {
      id: savedUser.id,
      email: savedUser.email,
      name: savedUser.name,
    };
  }

  async checkIfUserExists(user: CreateUserDto) {
    const isUserExists = await this.userRepository.findOne({
      email: user.email,
    });
    return isUserExists;
  }

  async hashPassword(password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }
}
