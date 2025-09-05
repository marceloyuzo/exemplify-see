import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { FirebaseConfig } from 'src/config/firebase.config'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'

interface LoginProps {
  firebaseToken: string
}

interface JwtPayload {
  sub: string
  email: string
  firebaseUid: string
  role: string
  photoURL?: string
  iat: number
  exp: number
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private usersService: UsersService,
    private firebaseConfig: FirebaseConfig,
    private jwtService: JwtService,
  ) {}

  async login({ firebaseToken }: LoginProps) {
    try {
      const decodedToken = await this.firebaseConfig.verifyToken({
        token: firebaseToken,
      })

      let user = await this.usersService.findByFirebaseUid(decodedToken.uid)

      if (!user) {
        user = await this.usersService.create({
          firebaseUid: decodedToken.uid,
          email: decodedToken.email as string,
          name: decodedToken.name,
          photoURL: decodedToken.picture,
        })
      }

      const payload = {
        sub: user.id,
        email: user.email,
        firebaseUid: user.firebaseUid,
        role: user.role,
        photoURL: user.photoURL,
      }

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_SECRET,
      })

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          photoURL: user.photoURL,
        },
        accessToken,
      }
    } catch (error) {
      this.logger.error('❌ Erro na autenticação:', error)
      throw new UnauthorizedException('Token Firebase inválido')
    }
  }

  async validateUser(payload) {
    const user = await this.usersService.findByFirebaseUid(payload.firebaseUid)
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado ou inativo')
    }
    return user
  }

  async refreshToken(user): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      firebaseUid: user.firebaseUid,
      role: user.role,
      photoURL: user.photoURL,
    }

    return this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET,
    })
  }

  async verifyToken(token: string): Promise<Partial<User>> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      })

      const currentTime = Math.floor(Date.now() / 1000)
      if (payload.exp < currentTime) {
        throw new UnauthorizedException('Token expirado')
      }

      const user = await this.usersService.findById(payload.sub)
      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado')
      }

      return {
        id: user.id,
        email: user.email,
        firebaseUid: user.firebaseUid,
        role: user.role,
        name: user.name,
        photoURL: user.photoURL,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    } catch (error) {
      // Tratamento específico para diferentes tipos de erro JWT
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token inválido')
      }

      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expirado')
      }

      if (error.name === 'NotBeforeError') {
        throw new UnauthorizedException('Token ainda não é válido')
      }

      // Se já é uma UnauthorizedException, re-lançar
      if (error instanceof UnauthorizedException) {
        throw error
      }

      // Para outros erros, logar e lançar erro genérico
      console.error('Erro na verificação do token:', error)
      throw new UnauthorizedException('Erro na verificação do token')
    }
  }
}
