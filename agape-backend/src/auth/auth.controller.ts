import { Request, Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards, BadRequestException, HttpException, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
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
        if (!refreshToken) {
            // evita pasar undefined al servicio y deja respuesta clara al cliente
            throw new UnauthorizedException('Refresh token missing');
        }
        try {
            return await this.authService.refreshToken(refreshToken);
        } catch (err) {
            // mantiene HttpException original o transforma errores inesperados
            if (err instanceof HttpException) throw err;
            console.error('Error in refresh:', err);
            throw new InternalServerErrorException('Error validating refresh token');
        }
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('refresh_token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // true en producción (HTTPS)
        maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return { ok: true };
    }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@Request() req) {
        try {
            const user = await this.authService.findOne(req.user.id_Usuario);
            if (!user) {
                throw new UnauthorizedException('Usuario no encontrado');
            }
            const { contraseña, ...result } = user;
            return result;
        } catch (error) {
            throw new UnauthorizedException('Error al obtener perfil de usuario');
        }
    }

    

    @Post('google')
    async google(
    @Body('credential') credential: string,
    @Res({ passthrough: true }) res: Response,
        ) {
        if (!credential) {
            throw new BadRequestException('credential is required');
        }

        try {
            const result = await this.authService.loginWithGoogle(credential);
            const { access_token, refresh_token, user } = result ?? {};

            if (!access_token || !user) {
            throw new UnauthorizedException('Google login failed');
            }

            if (refresh_token) {
            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/', // opcional: asegurar path
            });
            }

            return { access_token, user };
        } catch (err) {
            // Opcional: loggear err (no mandar stack al cliente en producción)
            console.error('Error en /auth/google:', err);
            // si err ya es HttpException lo re-lanzamos para mantener el status original
            if (err instanceof HttpException) throw err;
            throw new InternalServerErrorException('Error interno al procesar login con Google');
        }
    }

}


