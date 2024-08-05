import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from './token.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { IDataUser } from 'src/interfaces/common/commom.interface';
import { TokenHelper } from 'src/helpers/token.help';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(TokenEntity)
    private tokenRepository: Repository<TokenEntity>,
  ) {}

  async createToken(user: UserEntity) {
    const payload: IDataUser = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      birth: user.birth,
      isManager: user.isManager,
      isDirector: user.isDirector,
    };

    // Tạo key
    const { privateKey: privateKeyAccessToken, publicKey: publicKeyAccessToken } = TokenHelper.generateKeyPair();
    const { privateKey: privateKeyAccessRefresh, publicKey: publicKeyAccessRefresh } = TokenHelper.generateKeyPair();

    // Tạo access token
    const accessToken = await TokenHelper.createToken({
      privateKey: privateKeyAccessToken,
      payload,
      jwtService: this.jwtService,
    });

    // Tạo refresh token
    const refreshToken = await TokenHelper.createToken({
      privateKey: privateKeyAccessRefresh,
      payload,
      jwtService: this.jwtService,
      expiresIn: (365 * 24 * 60 * 60)
    });

    // Lưu token vào database với id User
    const dataToken = this.tokenRepository.create({
      token_access: accessToken,
      token_keyRefresh: refreshToken,
      token_keyAccess: publicKeyAccessToken,
      token_refresh: publicKeyAccessRefresh,
      token_user: { id: user.id },
    });
    await this.tokenRepository.save(dataToken);

    return { token: accessToken, user: payload };
  }

  async findTokenByUser(user: UserEntity) {
    return await this.tokenRepository.findOne({
      where: { token_user: { id: user.id } },
    });
  }

  async findTokeByCode(code: string) {
    return await this.tokenRepository.findOne({
      where: { token_access: code },
    });
  }

  async deleteTokenToId(id: string) {
    return await this.tokenRepository.delete(id);
  }

  async deleteTokenByUserId(userId: string) {
    return await this.tokenRepository
      .createQueryBuilder()
      .delete()
      .where('token_user = :id', { id: userId })
      .execute();
  }
}
