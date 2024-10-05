import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from './token.entity';
import { Repository } from 'typeorm';
import { IDataUser } from 'src/interfaces/common/commom.interface';
import { TokenHelper } from 'src/helpers/token.help';
import { CookieHelper } from 'src/helpers/cookie.helper';
import { Response } from 'express';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(TokenEntity)
    private tokenRepository: Repository<TokenEntity>,
  ) {}

  async createToken(user: IDataUser, res: Response) {
    const payload: IDataUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      birth: user.birth,
      isManager: user.isManager,
      isDirector: user.isDirector,
    };

    // Tạo key
    const {
      privateKey: privateKeyAccessToken,
      publicKey: publicKeyAccessToken,
    } = TokenHelper.generateKeyPair();
    const {
      privateKey: privateKeyAccessRefresh,
      publicKey: publicKeyAccessRefresh,
    } = TokenHelper.generateKeyPair();

    // Tạo access token
    const accessToken = await TokenHelper.createToken({
      privateKey: privateKeyAccessToken,
      payload,
      jwtService: this.jwtService,
    });

    // set token for cookie
    CookieHelper.setCookie({ name: 'token', value: accessToken, res });

    // Tạo refresh token
    const refreshToken = await TokenHelper.createToken({
      privateKey: privateKeyAccessRefresh,
      payload,
      jwtService: this.jwtService,
      expiresIn: 365 * 24 * 60 * 60,
    });

    // Lưu token vào database với id User
    const dataToken = this.tokenRepository.create({
      token_access: accessToken,
      token_refresh: refreshToken,
      token_keyAccess: publicKeyAccessToken,
      token_keyRefresh: publicKeyAccessRefresh,
      token_user: { id: user.id },
    });

    //
    const findToken = await this.findTokenByUser(user);
    if (!findToken) {
      const newToken = await this.tokenRepository.save(dataToken);
      if (!newToken) {
        throw new BadRequestException('login failed');
      }
    } else {
      const newToken = await this.tokenRepository
        .createQueryBuilder()
        .update(TokenEntity)
        .where('id = :id', { id: findToken.id })
        .set({
          token_access: accessToken,
          token_keyAccess: publicKeyAccessToken,
          token_refresh: refreshToken,
          token_keyRefresh: publicKeyAccessRefresh,
        })
        .execute();
      if (!newToken.affected) {
        throw new BadRequestException('login failed');
      }
    }

    return { token: accessToken, user: payload };
  }

  async findTokenByUser(user: IDataUser) {
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
