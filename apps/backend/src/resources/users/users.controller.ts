import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { UsersService } from './users.service'
import { EditUserDto } from './dto/edit-user-dto'
import { AdminGuard } from 'src/common/guards/admin.guard'

@Controller('/users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name)

  constructor(private usersService: UsersService) {}

  @Put('/update-profile/:id')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Param('id') id: string,
    @Body() { name, email, role }: EditUserDto,
  ) {
    return await this.usersService.update(id, { email, name, role })
  }

  @Put('/update-user/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() { name, email, role }: EditUserDto,
  ) {
    return await this.usersService.update(id, { email, name, role })
  }

  @Get('')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async findUsers(
    @Query('page') page: string = '1',
    @Query('perPage') perPage: string = '10',
    @Query('orderBy') orderBy: 'asc' | 'desc' = 'desc',
    @Query('name') name?: string,
    @Query('role') role?: 'admin' | 'user',
  ) {
    return this.usersService.findManyUsers({
      page: Number(page),
      perPage: Number(perPage),
      name,
      role,
      orderBy,
    })
  }
}
