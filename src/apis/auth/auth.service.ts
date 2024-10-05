import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { LoginDto, ResetPasswordDto } from './auth.dto';
import { IResponseLogin } from 'src/interfaces/common/commom.interface';
import * as bcrypt from 'bcrypt';
import { TokenService } from '../token/token.service';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly otpService: OtpService,
    private tokenService: TokenService,
  ) {}

  async login(dataLogin: LoginDto): Promise<IResponseLogin> {
    const findUserByEmail = await this.userRepository.findOne({
      where: { email: dataLogin.email },
      select: {
        id: true,
        email: true,
        fullName: true,
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
      throw new BadRequestException('wrong username or password');
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

  async resetPassword(dataForm: ResetPasswordDto): Promise<boolean> {
    //
    if (dataForm.password !== dataForm.password_confirm) {
      throw new BadRequestException('Confirmation password is incorrect');
    }

    //
    const findOtpByEmail = await this.otpService.findOneOtpByEmail(
      dataForm.email,
    );
    if (!findOtpByEmail) {
      throw new BadRequestException(
        'There is no session with this email address',
      );
    }

    if (!findOtpByEmail.isConfirm) {
      throw new BadRequestException('The session has ended');
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(dataForm.password, salt);
      await this.userRepository
        .createQueryBuilder()
        .update(UserEntity)
        .where('email = :email', { email: findOtpByEmail.email })
        .set({ password: hashedPassword })
        .execute();
      await this.otpService.deleteOtpByEmail(findOtpByEmail.email);
    }
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
