import { IsEmpty, Length } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { ABaseModal } from 'src/abstracts/ABaseModal.abstract';

@Entity('otp')
export class OtpEntity extends ABaseModal {
  @Column()
  @IsEmpty()
  email: string;

  @Column()
  @IsEmpty()
  @Length(6, 6, { message: 'OTP code must be 6 characters long' })
  otpCode: string;

  @Column({ default: false })
  isConfirm: boolean;

  @Column()
  expiresAt: Date;
}