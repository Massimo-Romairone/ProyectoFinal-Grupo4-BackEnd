import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { email, contraseña } = loginDto;
        const { access_token, refresh_token, user } = await this.authService.signIn(
        email,
        contraseña,
        );

        res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // true en producción (HTTPS)
        maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { access_token, user };
    }

    @Post('refresh')
    async refresh(@Req() req: Request & { cookies?: Record<string, any> }) {
        const refreshToken = req.cookies?.refresh_token;
        return this.authService.refreshToken(refreshToken);
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('refresh_token', {
        httpOnly: true,
        sameSite: 'lax',
        });
        return { ok: true };
    }
}
