import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotAcceptableException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/apis/token/token.service';
import { TokenHelper } from 'src/helpers/token.help';
import { Request, Response } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const token = request.cookies?.['token'];

    //
    if (!token) {
      throw new NotAcceptableException('Please login again');
    }

    //
    try {
      const publicKey = (await this.tokenService.findTokeByCode(token))
        .token_keyAccess;
      const payload = await TokenHelper.verifyToken({
        token,
        publicKey,
        jwtService: this.jwtService,
      });
      request['user'] = payload;
      return true;
    } catch (error) {
      if (error.message === 'jwt expired') {
        const tokenRow = await this.tokenService.findTokeByCode(token);
        const refreshToken = tokenRow.token_refresh;
        const keyRefresh = tokenRow.token_keyRefresh;

        const payload = await TokenHelper.verifyToken({
          token: refreshToken,
          publicKey: keyRefresh,
          jwtService: this.jwtService,
        });

        // Create a new token (access, refresh save database)
        await this.tokenService.createToken(payload, response);

        // Set request
        request['user'] = payload;
        console.log('Het han roi');
        return true;
      } else {
        throw new ForbiddenException('Invalid token');
      }
    }
  }
}
