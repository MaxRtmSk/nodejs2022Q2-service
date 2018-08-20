import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login() {
    this.authService.login();
  }

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  signup(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signup(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh() {
    this.authService.refresh();
  }
}
