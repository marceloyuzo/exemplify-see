import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from 'src/resources/users/users.service'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name)

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()

    const token = request.cookies?.accessToken

    if (!token) {
      throw new UnauthorizedException('Token de acesso não encontrado')
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      })

      const user = await this.usersService.findById(payload.sub)

      if (!user || !user.isActive) {
        this.logger.warn(`Usuário inválido: ${payload.email}`)
        throw new UnauthorizedException('Usuário inválido')
      }

      const currentTime = Math.floor(Date.now() / 1000)
      const tokenExp = payload.exp
      const timeUntilExpiry = tokenExp - currentTime

      // 24 * 60 * 60 = 1 dia
      if (timeUntilExpiry < 24 * 60 * 60) {
        const newPayload = {
          sub: user.id,
          email: user.email,
          firebaseUid: user.firebaseUid,
          role: user.role,
          photoURL: user.photoURL,
        }

        const newToken = this.jwtService.sign(newPayload, {
          expiresIn: '7d',
          secret: process.env.JWT_SECRET,
        })

        response.cookie('accessToken', newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // deve ser true em prod
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // permite cross-site
          domain: '.exemplify-see.com', // necessário para cross-subdomain
          path: '/', // igual ao cookie original
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
        })
      }

      request.user = user

      return true
    } catch (error) {
      this.logger.error('Erro na validação do token:', error.message)

      response.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        domain: '.exemplify-see.com', // igual ao cookie original
        path: '/', // igual ao cookie original
      })

      throw new UnauthorizedException('Token inválido ou expirado')
    }
  }
}
