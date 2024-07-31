import { Body, Controller, Post, Res } from '@nestjs/common';
import { ConfirmOtpDto, CreateSessionOtpDto, SendOtpDto } from './otp.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OtpService } from './otp.service';
import { Response } from 'express';

@ApiTags('Otp')
@Controller('/otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('createSessionOtp')
  @ApiOperation({ summary: 'Create a new session otp' })
  async createSessionOtp(
    @Body() dataForm: CreateSessionOtpDto,
    @Res() res: Response,
  ) {
    await this.otpService.createSessionOtp(dataForm);
    res.status(200).json({
      message: 'Send otp successfully',
      statusCode: 200,
    });
  }

  @Post('sendOtp')
  @ApiOperation({ summary: 're-send otp' })
  async sendOtp(@Body() dataSendEmail: SendOtpDto, @Res() res: Response) {
    await this.otpService.sendOtp(dataSendEmail.email, dataSendEmail.otpCode);

    res.status(200).json({
      message: 'Send email successfully',
      statusCode: 200,
    });
  }

  @Post('confimOtp')
  @ApiOperation({ summary: 'Confim otp ' })
  async confimOtp(@Body() dataForm: ConfirmOtpDto, @Res() res: Response) {
    await this.otpService.confirmOtp(dataForm);
    res.status(200).json({
      message: 'Confirm otp successfully',
      statusCode: 200,
    });
  }
}
