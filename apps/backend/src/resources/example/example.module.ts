import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database/database.module'
import { ExampleController } from './example.controller'
import { ExampleService } from './example.service'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'

@Module({
  imports: [DatabaseModule],
  controllers: [ExampleController],
  providers: [ExampleService, JwtService, UsersService],
})
export class ExampleModule {}
