import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database/database.module'
import { ExampleController } from './example.controller'
import { ExampleService } from './example.service'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { AttachmentsService } from '../attachment/attachment.service'
import { R2Service } from 'src/storage/r2.service'

@Module({
  imports: [DatabaseModule],
  controllers: [ExampleController],
  providers: [
    ExampleService,
    JwtService,
    UsersService,
    AttachmentsService,
    R2Service,
  ],
})
export class ExampleModule {}
