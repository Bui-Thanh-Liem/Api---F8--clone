import { ABaseEntity } from 'src/abstracts/ABaseModal.abstract';
import { Column, Entity } from 'typeorm';

@Entity('user')
export class UserEntity extends ABaseEntity {
  @Column()
  fullName: string;

  @Column()
  birth: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  isManager: boolean = false;

  @Column()
  isDirector: boolean = false;
}
