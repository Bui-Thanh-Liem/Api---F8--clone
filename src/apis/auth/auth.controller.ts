import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoginDto, ResetPasswordDto } from './auth.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { CookieHelper } from 'src/helpers/cookie.helper';
import { AuthGuard } from 'src/guard/auth.guard';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';

@Controller('/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @UseInterceptors(new LoggingInterceptor())
  @ApiOperation({ summary: 'Login' })
  async login(@Body() dataLogin: LoginDto, @Res() res: Response) {
    // login
    const dataLogined = await this.authService.login(dataLogin);

    // set token
    CookieHelper.setCookie({ name: 'token', value: dataLogined.token, res });

    // return
    res.status(200).json({
      message: 'Login successful',
      data: dataLogined,
      statusCode: 200,
    });
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Logout' })
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.authService.logout(req);

    // Clear cookies
    CookieHelper.clearCookei({ name: 'token', res });
    res.status(200).json({
      message: 'Logout successful',
    });
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Reset Password' })
  async forgotPassword(
    @Body() dataForm: ResetPasswordDto,
    @Res() res: Response,
  ) {
    await this.authService.resetPassword(dataForm);
    res.status(200).json({
      message: 'Reset Password successful',
      statusCode: 200,
    });
  }

  @Get('/get-me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get Me' })
  async getMe(@Req() req: Request, @Res() res: Response) {
    const me = await this.authService.getMe(req);
    res.status(200).json({
      message: 'Get me successfully',
      data: me,
    });
  }
}
