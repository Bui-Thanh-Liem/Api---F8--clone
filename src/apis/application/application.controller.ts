// import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
// import { LeaveRequestService } from './leave-request.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { User } from '../decorators/user.decorator';

// @Controller('leave-requests')
// @UseGuards(JwtAuthGuard)
// export class LeaveRequestController {
//   constructor(private readonly leaveRequestService: LeaveRequestService) {}

//   @Post()
//   create(
//     @Body() createLeaveRequestDto: CreateLeaveRequestDto,
//     @User() user: User,
//   ) {
//     return this.leaveRequestService.create(createLeaveRequestDto, user);
//   }

//   @Post(':id/approve-manager')
//   approveByManager(
//     @Param('id') id: string,
//     @Body('comment') comment: string,
//     @User() user: User,
//   ) {
//     return this.leaveRequestService.approveByManager(+id, comment, user);
//   }

//   @Post(':id/approve-director')
//   approveByDirector(
//     @Param('id') id: string,
//     @Body('comment') comment: string,
//     @User() user: User,
//   ) {
//     return this.leaveRequestService.approveByDirector(+id, comment, user);
//   }
// }
