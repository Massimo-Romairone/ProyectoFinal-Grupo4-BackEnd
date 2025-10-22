import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usuarioService: UsuarioService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'dev_secret_very_insecure',
    });
  }

  async validate(payload: any) {
    const user = await this.usuarioService.findOneByEmail(payload.email);

    if (!user) return null;
    const { contraseña, password, passwordHash, ...safeUser } = user as any;
    return safeUser;
  }
}
