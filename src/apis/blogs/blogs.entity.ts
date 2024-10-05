import { ABaseEntity } from "src/abstracts/ABaseModal.abstract";
import { Column, Entity, ManyToOne } from "typeorm";
import { IsNotEmpty } from "class-validator";
import { UserEntity } from "../user/user.entity";

import { IsEnum, IsNumber } from 'class-validator';
import { ETypeTimer } from "src/enums/common.enum";

export class ITimer {
  @IsEnum(ETypeTimer, { message: 'Type must be a valid ETypeTimer enum value' })
  type: ETypeTimer;

  @IsNumber()
  value: number;
}

@Entity('blog')
export class BlogEntity extends ABaseEntity {

    @Column()
    @IsNotEmpty({message: "Title is not empty"})
    title: string;

    @Column()
    @IsNotEmpty({message: "Description is not empty"})
    description: string;

    @ManyToOne(() => UserEntity, (user) => user.id, {nullable: true})
    @IsNotEmpty({message: "Creator is not empty"})
    creator: UserEntity;
    
    @Column('json')
    @IsNotEmpty({message: "Timer is not empty"})
    timer: ITimer;

    @Column({ default: false})
    isPost: boolean;
}

