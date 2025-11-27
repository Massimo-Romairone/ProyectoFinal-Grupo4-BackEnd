import { Body, Controller, Post, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { Response } from 'express';

@Controller('auth/google')
export class GoogleAuthController {
  constructor(private googleAuthService: GoogleAuthService) {}

  @Post('callback')
  @HttpCode(HttpStatus.OK)
  async googleLogin(@Body('token') token: string, @Res({ passthrough: true }) res: Response) {
    const { access_token, refresh_token, user } = await this.googleAuthService.validateToken(token);

    // setear cookie refresh_token igual que en /auth/login
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // true en producción
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { access_token, user };
  }
}