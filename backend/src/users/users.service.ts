import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from '../auth/dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  async create(user: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashPassword(user.password);
    const newUser = this.usersRepository.create({
      ...user,
      password: hashedPassword,
    });
    return this.usersRepository.save(newUser);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    const hashedPassword = await this.hashPassword(newPassword);
    await this.usersRepository.update(userId, { password: hashedPassword });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (updateUserDto.password && updateUserDto.currentPassword) {
      const passwordMatch = await bcrypt.compare(
        updateUserDto.currentPassword,
        user.password,
      );
      if (!passwordMatch) {
        throw new BadRequestException('Current password is incorrect');
      }
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }
    const { currentPassword, ...updateData } = updateUserDto;
    await this.usersRepository.update(id, updateData);
    return this.usersRepository.findOneBy({ id });
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
}
