import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { Response } from 'express'
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
      this.clearAuthCookies(response)
      throw new UnauthorizedException('Token de acesso não encontrado')
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      })

      const user = await this.usersService.findById(payload.sub)

      if (!user || !user.isActive) {
        this.logger.warn(`Usuário inválido: ${payload.email}`)
        this.clearAuthCookies(response)
        throw new UnauthorizedException('Usuário inválido')
      }

      // Renovar token se necessário
      const shouldRenewToken = this.shouldRenewToken(payload.exp)
      if (shouldRenewToken) {
        this.renewAccessToken(response, user)
      }

      request.user = user
      return true
    } catch (error) {
      this.logger.error('Erro na validação do token:', error.message)
      this.clearAuthCookies(response)
      throw new UnauthorizedException('Token inválido ou expirado')
    }
  }

  private shouldRenewToken(tokenExp: number): boolean {
    const currentTime = Math.floor(Date.now() / 1000)
    const timeUntilExpiry = tokenExp - currentTime

    // Renovar se restam menos de 1 dia (86400 segundos)
    return timeUntilExpiry < 86400
  }

  private renewAccessToken(response: Response, user: User): void {
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

    // Configuração consistente com o controller
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      path: '/',
    } as const

    response.cookie('accessToken', newToken, cookieOptions)

    // Também atualizar o cookie de status se necessário
    response.cookie('auth-status', 'authenticated', {
      ...cookieOptions,
      httpOnly: false,
      domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined,
    })

    this.logger.debug('Token renovado com sucesso')
  }

  private clearAuthCookies(response: Response): void {
    const clearOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    } as const

    // Limpar ambos os cookies
    response.clearCookie('accessToken', clearOptions)

    response.clearCookie('auth-status', {
      ...clearOptions,
      httpOnly: false,
      // Não usar domínio - deixar o browser definir automaticamente
    })
  }
}
