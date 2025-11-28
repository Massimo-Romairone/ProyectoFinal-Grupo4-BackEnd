import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client;

  constructor(private jwtService: JwtService, private usersService: UsuarioService) {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async validateToken(token: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload?.email) throw new UnauthorizedException('Token inválido');

      let user = await this.usersService.findOneByEmail(payload.email);

      if (!user) {
        const randomPass = Math.random().toString(36).slice(2, 12);
        const hashed = await bcrypt.hash(randomPass, 10);

        user = await this.usersService.create({
          nombre: payload.given_name || '',
          apellido: payload.family_name || '',
          email: payload.email,
          nombreUsuario: (payload.email || '').split('@')[0],
          contraseña: hashed,
        });
      }

      const payloadJwt = { sub: user.id_Usuario, email: user.email };
      const access_token = this.jwtService.sign(payloadJwt, { expiresIn: '15m' });
      const refresh_token = this.jwtService.sign(payloadJwt, { expiresIn: '7d' });

      const { contraseña, ...safeUser } = user as any;
      return { access_token, refresh_token, user: safeUser };
    } catch (err) {
      throw new UnauthorizedException('Token de Google inválido');
    }
  }
}