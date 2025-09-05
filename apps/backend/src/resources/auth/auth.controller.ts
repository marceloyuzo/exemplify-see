import {
  Controller,
  Post,
  Res,
  Get,
  UseGuards,
  Req,
  HttpStatus,
  Logger,
  Headers,
} from '@nestjs/common'
import type { Response, Request } from 'express'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { User } from '@prisma/client'

interface AuthLoginResponse {
  success: boolean
  user: {
    id: string
    email: string
    name: string
    photoURL: string | null
  } | null

  message: string
}

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Headers('Authorization') authHeader: string,
    @Res() res: Response,
  ): Promise<void> {
    const token = authHeader?.split(' ')[1]

    try {
      const result = await this.authService.login({ firebaseToken: token })

      const isProduction = process.env.NODE_ENV === 'production'

      // Log para debug (remover depois)
      this.logger.log(`🔧 Environment: ${process.env.NODE_ENV}`)
      this.logger.log(`🔧 Is Production: ${isProduction}`)

      // Configuração base dos cookies
      const baseCookieOptions = {
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
        path: '/',
      } as const

      // Cookie do token (HttpOnly para segurança)
      const accessTokenOptions = {
        ...baseCookieOptions,
        httpOnly: true,
      }

      res.cookie('accessToken', result.accessToken, accessTokenOptions)
      this.logger.log('✅ AccessToken cookie definido')

      // Cookie de status - CONFIGURAÇÃO MAIS PERMISSIVA
      const authStatusOptions = {
        ...baseCookieOptions,
        httpOnly: false,
        // Tentar sem domínio primeiro em produção
        ...(isProduction ? {} : {}), // Removendo domain temporariamente
      }

      res.cookie('auth-status', 'authenticated', authStatusOptions)
      this.logger.log('✅ Auth-status cookie definido')

      // Log das configurações (remover depois)
      this.logger.log(
        '🔧 AccessToken options:',
        JSON.stringify(accessTokenOptions),
      )
      this.logger.log(
        '🔧 AuthStatus options:',
        JSON.stringify(authStatusOptions),
      )

      const response: AuthLoginResponse = {
        success: true,
        user: result.user,
        message: 'Login realizado com sucesso',
      }

      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      this.logger.error('❌ Erro no login:', error.message)

      const response: AuthLoginResponse = {
        success: false,
        user: null,
        message: 'Erro na autenticação',
      }

      res.status(HttpStatus.UNAUTHORIZED).json(response)
    }
  }

  @Post('logout')
  async logout(@Res() res: Response): Promise<void> {
    const isProduction = process.env.NODE_ENV === 'production'

    // Configuração base para limpeza dos cookies
    const baseClearOptions = {
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    } as const

    // Limpar accessToken
    res.clearCookie('accessToken', {
      ...baseClearOptions,
      httpOnly: true,
    })

    // Limpar auth-status - SEM DOMÍNIO
    res.clearCookie('auth-status', {
      ...baseClearOptions,
      httpOnly: false,
    })

    this.logger.log('✅ Cookies limpos no logout')

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Logout realizado com sucesso',
    })
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request & { user: User }) {
    const user = req.user

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        photoURL: user.photoURL,
        firstTime: user.firstTime,
      },
    }
  }

  @Get('check')
  @UseGuards(JwtAuthGuard)
  async checkAuth(@Req() req: Request & { user: User }) {
    const user = req.user

    return {
      success: true,
      message: 'Token válido',
      user: user.email,
      timestamp: new Date().toISOString(),
    }
  }
}
