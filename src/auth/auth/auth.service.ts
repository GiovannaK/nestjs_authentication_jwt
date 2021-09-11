/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserdto: CreateUserDto) {
    const userAlreadyExists = await this.checkIfUserExists(createUserdto.email);
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

  async validateUser(userEmail: string, userPassword: string) {
    const user = await this.checkIfUserExists(userEmail);
    const passwordMatch = await this.matchPassword(userPassword, user.password);
    if (passwordMatch) {
      const { id, name, email } = user;
      return { id, name, email };
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async checkIfUserExists(email: string) {
    const isUserExists = await this.userRepository.findOne({
      email,
    });
    return isUserExists;
  }

  async hashPassword(password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  async matchPassword(password: string, storedPassword: string) {
    const isPasswordMatch = await bcrypt.compare(password, storedPassword);
    if (!isPasswordMatch) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Incorrect email or password',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return isPasswordMatch;
  }
}
