import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<Request>()
    const method = req.method
    const url = req.url

    console.log(`[${method}] ${url}`)

    return next.handle().pipe(
      tap(() => {
        console.log(`[${method}] ${url} - Finalizado`)
      }),
    )
  }
}
