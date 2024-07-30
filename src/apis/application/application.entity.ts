// import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
// import { UserEntity } from '../user/user.entity';

// @Entity()
// export class ApplicationForLeaveEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => UserEntity)
//   employee: UserEntity;

//   @Column()
//   startDate: string;

//   @Column()
//   endDate: string;

//   @Column()
//   reason: string;

//   @Column({
//     type: 'enum',
//     enum: ['pending', 'approved_by_manager', 'approved', 'rejected'],
//     default: 'pending',
//   })
//   status: string;

//   @Column({ nullable: true })
//   managerComment: string;

//   @Column({ nullable: true })
//   directorComment: string;
// }