import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { IDataUser } from 'src/interfaces/common/commom.interface';

export class TokenHelper {
  static generateKeyPair() {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
        // cipher: 'aes-256-cbc',
        // passphrase: 'top secret',
      },
    });
    return { privateKey, publicKey };
  }

  static async createToken({
    privateKey,
    payload,
    jwtService,
  }: {
    privateKey: string;
    payload: IDataUser;
    jwtService: JwtService;
  }): Promise<string> {
    const newToken = await jwtService.signAsync(payload, {
      algorithm: 'RS256',
      expiresIn: '1d',
      secret: privateKey,
    });
    return newToken;
  }

  static async verifyToken({
    token,
    publicKey,
    jwtService,
  }: {
    token: string;
    publicKey: string;
    jwtService: JwtService;
  }): Promise<IDataUser> {
    try {
      const dataVerifyToken = await jwtService.verifyAsync(token, {
        secret: publicKey,
      });
      return dataVerifyToken;
    } catch (error) {
      throw new UnauthorizedException(
        'token verification failed, please login again',
      );
    }
  }
}
