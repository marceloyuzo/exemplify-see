import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common'

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name)

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      this.logger.warn('Usuário não encontrado na requisição')
      throw new ForbiddenException('Acesso negado: usuário não autenticado')
    }

    if (user.role !== 'admin') {
      this.logger.warn(
        `Tentativa de acesso negada para usuário ${user.email} com role: ${user.role}`,
      )
      throw new ForbiddenException(
        'Acesso negado: apenas administradores podem acessar este recurso',
      )
    }

    this.logger.log(`Acesso concedido para admin: ${user.email}`)
    return true
  }
}
