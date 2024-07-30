import { Entity, Column, Index, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ABaseModal } from 'src/global/global.abstract';

@Entity('token')
export class TokenEntity extends ABaseModal {
  @Column('text') // chuỗi ký tự dài
  @Index({ fulltext: true }) // Định nghĩa một chỉ mục toàn văn
  token_code: string;

  @Column('text')
  token_secretKey: string;

  @OneToOne(() => UserEntity) // 1 -1 to UserEntity
  @JoinColumn({ name: 'token_user_id' }) // foreign key
  token_user: UserEntity; // tokenRepository.findOne({ relations: ['token_user'] })
}