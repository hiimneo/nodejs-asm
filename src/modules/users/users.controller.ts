import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdatePasswordDto } from 'src/dtos/user/update-password.dto';
import { Public } from 'src/decorators/IsPublic';
import { CreateUserDto } from 'src/dtos/user/create-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async findAll() {
    return await this.usersService.findAll()
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.usersService.findById(id)
  }

  @Public()
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto)
  }

  @Put(':id')
  async updatePassword(@Param('id') id: string, @Body() updatePasswordDto: UpdatePasswordDto) {
    return await this.usersService.updatePassword(id, updatePasswordDto)
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.deleteUser(id)
  }
}
