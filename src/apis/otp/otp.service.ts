import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConfirmOtpDto, CreateSessionOtpDto } from './otp.dto';
import { sendMail } from 'src/helpers/mail.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { OtpEntity } from './otp.entity';
import * as bcrypt from 'bcrypt';

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

    // Delete code old for email
    await this.otpRepository.delete({ email: dataForm.email });

    // Save database
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
    const salt = await bcrypt.genSalt(10);
    const hashOtp = await bcrypt.hash(otpCode, salt);

    //
    await this.otpRepository.save({
      email: dataForm.email,
      otpCode: hashOtp,
      expiresAt: expiresAt,
    });

    // send otp
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
      },
      order: { createdAt: 'DESC' },
    });

    // nếu có mà thời gian hết hạn thì đợt database sẽ tự động xóa
    if (!findOtp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    //
    const isValid = await bcrypt.compare(dataForm.otpCode, findOtp.otpCode);
    if (!isValid && findOtp.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    //
    findOtp.isConfirm = isValid;
    return await this.otpRepository.save(findOtp);
  }

  async findOneOtpByEmail(email: string): Promise<OtpEntity> {
    return await this.otpRepository.findOne({ where: { email: email } });
  }

  async deleteOtpByEmail(email: string): Promise<boolean> {
    await this.otpRepository.delete({ email: email });
    return true;
  }

  async deleteExpiredRecords(): Promise<boolean> {
    const result = await this.otpRepository.delete({
      expiresAt: LessThan(new Date()),
    });
    if (result) return !!result;
  }
}
