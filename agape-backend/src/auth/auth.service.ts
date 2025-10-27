import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private usuarioService: UsuarioService,
        private jwtService: JwtService,
    ) {}

    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.usuarioService.findOneByEmail(email);

        if (!user) throw new UnauthorizedException('Credenciales inválidas');

        const stored = user.contraseña;
        if (!stored) throw new UnauthorizedException('Usuario sin contraseña almacenada');

        const isHashed = /^\$2[aby]\$/.test(stored);
        const match = isHashed ? await bcrypt.compare(pass, stored) : pass === stored;

        if (!match) throw new UnauthorizedException('Credenciales inválidas');

        const payload = { sub: user.id_Usuario, email: user.email };

        const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

        const { contraseña, ...safeUser } = user;
        return { access_token, refresh_token, user: safeUser };
    }

    async register(registerDto: RegisterDto) {
        const existing = await this.usuarioService.findOneByEmail(registerDto.email);
        if (existing) {
        throw new ConflictException('Email ya registrado');
        }

        const hashedPassword = await bcrypt.hash(registerDto.contraseña, 10);

        const newUser = await this.usuarioService.create({
        ...registerDto,
        nombreUsuario: registerDto.nombreUsuario,
        contraseña: hashedPassword,
        });

        const { contraseña, ...safeUser } = newUser as any;
        return safeUser;
    }

    async refreshToken(refreshToken: string) {
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token faltante');
        }

        try {
            const payload = this.jwtService.verify(refreshToken);
            const access_token = this.jwtService.sign(
            { sub: payload.sub, email: payload.email },
            { expiresIn: '15m' },
            );
            return { access_token };
        } catch (e) {
            throw new UnauthorizedException('Refresh token inválido o expirado');
        }
    }

}
