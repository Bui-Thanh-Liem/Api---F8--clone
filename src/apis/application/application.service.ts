// import {
//   Injectable,
//   NotFoundException,
//   ForbiddenException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { ApplicationForLeaveEntity } from './applicationForLeave.entity';
// import { User } from './user.entity';

// @Injectable()
// export class LeaveRequestService {
//   constructor(
//     @InjectRepository(ApplicationForLeaveEntity)
//     private leaveRequestRepository: Repository<ApplicationForLeaveEntity>,
//   ) {}

//   async create(
//     createLeaveRequestDto: CreateLeaveRequestDto,
//     employee: User,
//   ): Promise<ApplicationForLeaveEntity> {
//     const leaveRequest = this.leaveRequestRepository.create({
//       ...createLeaveRequestDto,
//       employee,
//     });
//     return this.leaveRequestRepository.save(leaveRequest);
//   }

//   async approveByManager(
//     id: number,
//     managerComment: string,
//     manager: User,
//   ): Promise<LeaveRequest> {
//     const leaveRequest = await this.leaveRequestRepository.findOne(id);
//     if (!leaveRequest) {
//       throw new NotFoundException('Leave request not found');
//     }
//     if (!manager.isManager) {
//       throw new ForbiddenException('User is not a manager');
//     }
//     leaveRequest.status = 'approved_by_manager';
//     leaveRequest.managerComment = managerComment;
//     return this.leaveRequestRepository.save(leaveRequest);
//   }

//   async approveByDirector(
//     id: number,
//     directorComment: string,
//     director: User,
//   ): Promise<LeaveRequest> {
//     const leaveRequest = await this.leaveRequestRepository.findOne(id);
//     if (!leaveRequest) {
//       throw new NotFoundException('Leave request not found');
//     }
//     if (!director.isDirector) {
//       throw new ForbiddenException('User is not a director');
//     }
//     if (leaveRequest.status !== 'approved_by_manager') {
//       throw new ForbiddenException(
//         'Leave request has not been approved by manager',
//       );
//     }
//     leaveRequest.status = 'approved';
//     leaveRequest.directorComment = directorComment;
//     return this.leaveRequestRepository.save(leaveRequest);
//   }
// }
