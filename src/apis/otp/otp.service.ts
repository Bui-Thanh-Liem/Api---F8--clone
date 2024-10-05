import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConfirmOtpDto, CreateSessionOtpDto } from './otp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { OtpEntity } from './otp.entity';
import { InjectQueue } from '@nestjs/bull';
import * as bcrypt from 'bcrypt';
import { Queue } from 'bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,
    private readonly userService: UserService,

    @InjectQueue('send-mail')
    private queueSendMail: Queue,

    @Inject(CACHE_MANAGER) 
    private cacheManager: Cache 
  ) {}

  async sendOtp(email: string, otpCode: string) {

    // Throw redis -> Consumer handle job in background
    await this.queueSendMail.add(
      'otp',
      {
        mailTo: email,
        html: `<h1 style={color: "red"}>Your OTP code is ${otpCode}</h1>`,
      },
      {
        removeOnComplete: true,
      },
    );

    // Save otpCode in database
    this.cacheManager.set('otp', otpCode, (60 * 10)); // Cache automatically
    
    return true;
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

    // send otp
    const isSendOtp = await this.sendOtp(dataForm.email, otpCode);

    //
    await this.otpRepository.save({
      email: dataForm.email,
      otpCode: hashOtp,
      expiresAt: expiresAt,
    });

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

    // Cache
    const otpCode = this.cacheManager.get('otp'); // Cache automatically

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
