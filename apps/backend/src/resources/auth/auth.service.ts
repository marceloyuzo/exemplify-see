import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { FirebaseConfig } from 'src/config/firebase.config'
import { JwtService } from '@nestjs/jwt'

interface LoginProps {
  firebaseToken: string
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
}
