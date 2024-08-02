import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Res,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseData } from 'src/global/global.class';
import { HttpMessage, HttpStatusCode } from 'src/global/global.enum';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { UserEntity } from './user.entity';
import { ResponseOk } from 'src/abstracts/ABaseResponse.abstract';

@ApiTags('Users')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create User' })
  async create(@Body() dataForm: UserDto) {
    const { password, ...newUser } = await this.userService.create(dataForm);

    return new ResponseOk({
      message: 'Created user successfully',
      data: newUser,
    });
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update User' })
  async update(@Param('id') id: string, @Body() dataForm: UserDto) {
    //
    const updateUser = await this.userService.update(id, dataForm);

    //
    return new ResponseOk({
      message: 'Updated user successfully',
      data: updateUser,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get Users' })
  async findAll() {
    //
    const users = await this.userService.findAll();

    //
    return new ResponseOk({
      message: 'Get users successfully',
      data: users,
    });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get Details User' })
  async getDetails(@Param('id') id: string) {
    const user = this.userService.findOneById(id);

    return new ResponseOk({
      message: 'Get user details successfully',
      data: user,
    });
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete User' })
  async delete(@Param('id') id: string) {
    const result = await this.userService.delete(id);
    return new ResponseOk({
      message: 'User deleted successfully',
      data: result,
    });
  }
}
