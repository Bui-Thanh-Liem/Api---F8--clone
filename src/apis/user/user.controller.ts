import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseData } from 'src/global/global.class';
import { HttpMessage, HttpStatusCode } from 'src/global/global.enum';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { UserEntity } from './user.entity';

@ApiTags('Users')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create User' })
  async createUser(@Body() dataForm: UserDto) {
    const newUser = await this.userService.createUser(dataForm);
    return new ResponseData<Partial<UserEntity>>(
      newUser,
      HttpMessage.SUCCESS,
      HttpStatusCode.SUCCESS,
    );
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update User' })
  async updateUser(@Param('id') id: string, @Body() dataForm: UserDto) {
    //
    const updateUser = await this.userService.updateUser(id, dataForm);

    //
    if (!updateUser) {
      throw new BadRequestException(`Not found user with id ${id} !`);
    }

    //
    return new ResponseData<UserEntity>(
      updateUser,
      HttpMessage.SUCCESS,
      HttpStatusCode.SUCCESS,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get Users' })
  async getUserList() {
    //
    const users = await this.userService.getUserList();

    //
    if (!users) {
      throw new BadRequestException('Empty users list');
    }

    //
    return new ResponseData<UserEntity[]>(
      users,
      HttpMessage.SUCCESS,
      HttpStatusCode.SUCCESS,
    );
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get Details User' })
  async getUserDetails(@Param('id') id: string) {
    return new ResponseData<UserEntity>(
      await this.userService.getUserDetails(id),
      HttpMessage.SUCCESS,
      HttpStatusCode.SUCCESS,
    );
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete User' })
  async deleteUser(@Param('id') id: string) {
    return new ResponseData<boolean>(
      await this.userService.deleteUser(id),
      HttpMessage.SUCCESS,
      HttpStatusCode.SUCCESS,
    );
  }
}
