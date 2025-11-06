import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
    private client: OAuth2Client;

    constructor(
        private usuarioService: UsuarioService,
        private jwtService: JwtService,
    ) {
      const clientId = process.env.GOOGLE_CLIENT_ID;
        if (!clientId) {
            console.warn('GOOGLE_CLIENT_ID no definido. Google login fallará si se usa sin configurar la variable de entorno.');
        }
        this.client = new OAuth2Client(clientId);
    }

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
                { expiresIn: '1d' },
            );

            const user = await this.usuarioService.findOne(payload.sub);
            if (!user) throw new UnauthorizedException('Usuario no encontrado');

            return { access_token, user };
        } catch (e) {
            throw new UnauthorizedException('Refresh token inválido o expirado');
        }
    }

    async findOne(id: number) {
        return this.usuarioService.findOne(id);
    }

    async loginWithGoogle(credential: string) {
    if (!credential) throw new BadRequestException('credential required');

    const ticket = await this.client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) throw new BadRequestException('Invalid token');

    const email = payload.email;
    let user = await this.usuarioService.findOneByEmail(email);

    if (!user) {
            // crear usuario nuevo con contraseña aleatoria hasheada
            const randomPass = Math.random().toString(36).slice(2, 12);
            const hashed = await bcrypt.hash(randomPass, 10);

            const created = await this.usuarioService.create({
                nombreUsuario: (email.split('@')[0]) || '',
                nombre: payload.given_name || payload.name || '',
                apellido: payload.family_name || '',
                email,
                contraseña: hashed,
            } as any);

            user = created as any;
        }

        // payload consistente con signIn
        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado');
        }
        const jwtPayload = { sub: (user as any).id_Usuario ?? (user as any).id, email: user.email };
        const access_token = this.jwtService.sign(jwtPayload, { expiresIn: '15m' });
        const refresh_token = this.jwtService.sign(jwtPayload, { expiresIn: '7d' });

        // devolver usuario sin contraseña
        const { contraseña, ...safeUser } = user as any;
        return { access_token, refresh_token, user: safeUser };
  }

}
