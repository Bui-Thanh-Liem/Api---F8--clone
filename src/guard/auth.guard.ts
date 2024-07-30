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
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.['token'];

    //
    if (!token) {
      throw new NotAcceptableException('Please login again');
    }

    //
    try {
      const publicKey = (await this.tokenService.findTokeByCode(token))
        .token_secretKey;
      const payload = await TokenHelper.verifyToken({
        token,
        publicKey,
        jwtService: this.jwtService,
      });
      request['user'] = payload;
      return true;
    } catch (error) {
      throw new ForbiddenException('Invalid token');
    }
  }
}
