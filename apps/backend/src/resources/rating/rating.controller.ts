import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import { RatingService } from './rating.service'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { RateExampleDTO } from './dto/rate-example.dto'
import { User } from '@prisma/client'

@Controller('/rating')
export class RatingController {
  constructor(private ratingService: RatingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async rate(
    @Body() { rate, comment, exampleId, lessonPlanId }: RateExampleDTO,
    @Request() req: Request & { user: User },
  ) {
    const user = req.user

    return await this.ratingService.rating({
      comment,
      exampleId,
      lessonPlanId,
      rate,
      userId: user.id,
    })
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findRatingsByExample(
    @Query('page') page: string = '1',
    @Query('perPage') perPage: string = '10',
    @Query('exampleId') exampleId?: string,
    @Query('lessonPlanId') lessonPlanId?: string,
  ) {
    return await this.ratingService.findRatings({
      exampleId,
      lessonPlanId,
      page: Number(page),
      perPage: Number(perPage),
    })
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteExample(
    @Param('id') id: string,
    @Request() req: Request & { user: User },
  ) {
    const user = req.user

    return await this.ratingService.deleteRating({
      ratingId: id,
      userId: user.id,
    })
  }
}
