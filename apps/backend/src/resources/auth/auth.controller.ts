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

      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      })

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
    res.clearCookie('accessToken')

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
