import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Req,
  Res,
  HttpStatus,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { RequestWithUser } from '../common/request-with-user.interface';
import { Response } from 'express';
import { RolesGuard } from '../common/roles.guard';
import { Role } from '../enums/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('refresh-token')
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
    @Res() res: Response,
  ) {
    const newTokens = await this.authService.refreshAccessToken(refreshToken);
    if (!newTokens) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return res.status(HttpStatus.OK).json(newTokens);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const registrationResult = await this.authService.register(createUserDto);
    return res.status(HttpStatus.CREATED).json({
      accessToken: registrationResult.accessToken,
      refreshToken: registrationResult.refreshToken,
      role: registrationResult.role,
    });
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req: RequestWithUser,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    const result = await this.authService.changePassword(
      userId,
      updatePasswordDto,
    );
    return res.status(HttpStatus.OK).json(result); // Ensure new tokens are sent back
  }

  @Patch('admin-action')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [Role.Admin])
  async adminAction(@Req() req: RequestWithUser) {
    return { message: 'This action can only be accessed by an admin.' };
  }

  @Post('verify-token')
  @UseGuards(JwtAuthGuard)
  async verifyToken(@Req() req: RequestWithUser, @Res() res: Response) {
    return res.status(HttpStatus.OK).json({ role: req.user.role });
  }
}
