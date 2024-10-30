import {
  Controller,
  Get,
  Delete,
  Param,
  Body,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../common/user.decorator';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateUser(@Body() updateUserDto: UpdateUserDto, @User() user: any) {
    const userId = user.userId;

    if (!updateUserDto || !userId) {
      throw new Error('Invalid data');
    }

    const currentUser = await this.usersService.findOne(userId);

    if (updateUserDto.currentPassword) {
      const isPasswordMatching = await bcrypt.compare(
        updateUserDto.currentPassword,
        currentUser.password,
      );
      if (!isPasswordMatching) {
        throw new Error('Current password is incorrect');
      }
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    return this.usersService.updateUser(userId, updateUserDto);
  }
}
