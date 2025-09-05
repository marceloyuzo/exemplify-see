import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { DatabaseModule } from './database/database.module'
import { UsersModule } from './resources/users/users.module'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './resources/auth/auth.module'
import { ApproachModule } from './resources/approach/approach.module'
import { AxisModule } from './resources/axis/axis.module'
import { QuestionModule } from './resources/question/question.module'
import { LessonPlanModule } from './resources/lesson-plan/lesson-plan.module'
import { SubjectModule } from './resources/subject/subject.module'
import { TopicModule } from './resources/topic/topic.module'
import { ModelModule } from './resources/model/model.module'
import { ExampleModule } from './resources/example/example.module'
import { RatingModule } from './resources/rating/rating.module'
import { AttachmentModule } from './resources/attachment/attachment.module'

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
    LessonPlanModule,
    SubjectModule,
    TopicModule,
    ModelModule,
    ExampleModule,
    RatingModule,
    AttachmentModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
