import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { DatabaseModule } from './database/database.module'
import { UsersModule } from './resources/users/users.module'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './resources/auth/auth.module'
import { ApproachModule } from './resources/approach/approach.module'
import { AxisModule } from './resources/axis/axis.module'
import { QuestionModule } from './resources/question/question.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    ApproachModule,
    AxisModule,
    QuestionModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
