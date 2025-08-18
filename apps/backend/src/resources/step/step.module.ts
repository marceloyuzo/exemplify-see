import { Module } from '@nestjs/common'
import { StepService } from './step.service'
import { DatabaseModule } from 'src/database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [StepService],
  exports: [StepService],
})
export class StepModule {}
