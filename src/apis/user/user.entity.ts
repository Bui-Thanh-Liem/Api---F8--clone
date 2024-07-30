import { ABaseModal } from 'src/global/global.abstract';
import { Column, Entity } from 'typeorm';

@Entity('user')
export class UserEntity extends ABaseModal {
  @Column()
  fullname: string;

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
