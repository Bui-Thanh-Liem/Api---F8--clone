import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConfirmOtpDto, CreateSessionOtpDto } from './otp.dto';
import { sendMail } from 'src/helpers/mail.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtpEntity } from './otp.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,
    private readonly userService: UserService,
  ) {}

  async sendOtp(email: string, otpCode: string) {
    const infoSend = await sendMail({
      mailTo: email,
      html: `<h1 style={color: "red"}>Your OTP code is ${otpCode}</h1>`,
    });
    return infoSend;
  }

  async createSessionOtp(dataForm: CreateSessionOtpDto): Promise<boolean> {
    const findUser = await this.userService.findUserByEmail(dataForm.email);

    if (!findUser) {
      throw new BadRequestException('User not exist !');
    }

    // gui email
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    // Delete code old for email
    await this.otpRepository.delete({ email: dataForm.email });

    //
    await this.otpRepository.save({
      email: dataForm.email,
      otpCode: otpCode,
      expiresAt: expiresAt,
    });

    const isSendOtp = await this.sendOtp(dataForm.email, otpCode);

    if (!isSendOtp) {
      throw new BadRequestException(
        'An error occurred while sending OTP, please try again',
      );
    }
    return true;
  }

  async confirmOtp(dataForm: ConfirmOtpDto): Promise<OtpEntity> {
    const findOtp = await this.otpRepository.findOne({
      where: {
        email: dataForm.email,
        otpCode: dataForm.otpCode,
      },
      order: { createdAt: 'DESC' },
    });
    if (!findOtp || findOtp.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    findOtp.isConfirm = true;

    return await this.otpRepository.save(findOtp);
  }

  async findOneOtpByEmail(email: string): Promise<OtpEntity> {
    return await this.otpRepository.findOne({where: { email: email}});
  }

  async deleteOtpByEmail(email: string): Promise<boolean> {
    const deletedOtp = await this.otpRepository.delete({email: email})
    return true;
  }
}
