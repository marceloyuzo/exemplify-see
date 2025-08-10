import {
  Body,
  Controller,
  Get,
  Logger,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { UsersService } from './users.service'
import { EditUserDto } from './dto/edit-user-dto'

@Controller('/users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name)

  constructor(private usersService: UsersService) {}

  @Put('/update')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Body() { id, name, email, role }: EditUserDto) {
    return await this.usersService.update(id, { email, name, role })
  }

  @Get('/buscar-usuarios')
  @UseGuards(JwtAuthGuard)
  async findUsers(
    @Query('page') page: string = '1',
    @Query('perPage') perPage: string = '10',
    @Query('name') name?: string,
    @Query('role') role?: 'admin' | 'user',
  ) {
    return this.usersService.findManyUsers({
      page: Number(page),
      perPage: Number(perPage),
      name,
      role,
    })
  }
}
