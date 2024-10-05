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
      fullName: user.fullName,
      email: user.email,
      birth: user.birth,
      isManager: user.isManager,
      isDirector: user.isDirector,
    };

    // Tạo key
    const { privateKey, publicKey } = TokenHelper.generateKeyPair();

    // Tạo token
    const newToken = await TokenHelper.createToken({
      privateKey,
      payload,
      jwtService: this.jwtService,
    });

    // Lưu token vào database với id User
    const dataToken = this.tokenRepository.create({
      token_code: newToken,
      token_secretKey: publicKey,
      token_user: { id: user.id },
    });

    const findToken = await this.findTokenByUser(user);
    if (!findToken) {
      // Lưu token mới vào database
      const newToken = await this.tokenRepository.save(dataToken);
      if (!newToken) {
        throw new BadRequestException('Login failed');
      }
    } else {
      // Cập nhật token cũ
      const updateToken = await this.tokenRepository
        .createQueryBuilder()
        .update(TokenEntity)
        .where('id = :id', { id: findToken.id })
        .set({ token_code: newToken, token_secretKey: publicKey })
        .execute();
      if (!updateToken.affected) {
        throw new BadRequestException('Login failed');
      }
    }

    return { token: newToken, user: payload };
  }

  async findTokenByUser(user: UserEntity) {
    return await this.tokenRepository.findOne({
      where: { token_user: { id: user.id } },
    });
  }

  async findTokeByCode(code: string) {
    return await this.tokenRepository.findOne({
      where: { token_code: code },
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
