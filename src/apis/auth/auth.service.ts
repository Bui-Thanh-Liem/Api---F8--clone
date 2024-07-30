import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { LoginDto } from './auth.dto';
import { IResponseLogin } from 'src/interfaces/response/response.interface';
import * as bcrypt from 'bcrypt';
import { TokenService } from '../token/token.service';
import { IDataUser } from 'src/interfaces/common/commom.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private tokenService: TokenService,
  ) {}

  async login(dataLogin: LoginDto): Promise<IResponseLogin> {
    const findUserByEmail = await this.userRepository.findOne({
      where: { email: dataLogin.email },
      select: {
        id: true,
        email: true,
        fullname: true,
        password: true,
        birth: true,
        isDirector: true,
        isManager: true,
      },
    });

    //
    if (!findUserByEmail) {
      throw new BadRequestException('User not exist !, please login again');
    }

    // Check password
    const isPassword = await bcrypt.compare(
      dataLogin.password,
      findUserByEmail.password,
    );
    if (!isPassword) {
      throw new BadRequestException('Password not match, please login again');
    }

    //
    const { token, user } =
      await this.tokenService.createToken(findUserByEmail);
    return {
      user: user,
      token: token,
    };
  }

  async logout(req: Request): Promise<boolean> {
    const me = await this.getMe(req);

    if (!me) {
      throw new BadRequestException('Logout failed');
    }

    //
    const deleteToken = await this.tokenService.deleteTokenByUserId(me.id);
    if (!deleteToken.affected) {
      throw new BadRequestException('Logout Failed');
    }

    //
    req['user'] = null;
    return true;
  }

  async getMe(req: Request) {
    const dataUser = await req['user'];
    //
    const user = await this.userRepository.findOne({
      where: { id: dataUser.id },
    });
    return user;
  }
}
