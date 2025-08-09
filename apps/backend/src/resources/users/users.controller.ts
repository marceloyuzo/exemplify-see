import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { UsersService } from './users.service'

@Controller('/users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name)

  constructor(private usersService: UsersService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async findUsers(
    @Query('page') page: string = '1',
    @Query('perPage') perPage: string = '10',
    @Query('name') name?: string,
    @Query('role') role?: string,
  ) {
    return this.usersService.findManyUsers({
      page: Number(page),
      perPage: Number(perPage),
      name,
      role,
    })
  }
}
