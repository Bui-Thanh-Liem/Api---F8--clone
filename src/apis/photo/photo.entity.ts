import { ABaseModal } from 'src/abstracts/ABaseModal.abstract';
import { Entity, Column } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('photo')
export class PhotoEntity extends ABaseModal {
  @Column()
  @IsNotEmpty({ message: 'This field is not empty' })
  url: string;

  @Column()
  @IsNotEmpty({ message: 'This field is not empty' })
  public_id: string;
}
