import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Enrollments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'enrollments', version: '1' })
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get('my-courses')
  @ApiOperation({ summary: 'Get all enrolled courses for logged-in student' })
  getMyCourses(@CurrentUser() user: JwtPayload) {
    return this.enrollmentsService.getUserEnrollments(user.sub);
  }

  @Post(':courseId')
  @ApiOperation({ summary: 'Enroll current user in a course' })
  enroll(@Param('courseId') courseId: string, @CurrentUser() user: JwtPayload) {
    return this.enrollmentsService.enroll(user.sub, courseId);
  }

  @Get(':courseId/progress')
  @ApiOperation({ summary: 'Get course progress for current user' })
  getProgress(@Param('courseId') courseId: string, @CurrentUser() user: JwtPayload) {
    return this.enrollmentsService.getCourseProgress(user.sub, courseId);
  }

  @Post(':courseId/lessons/:lessonId/progress')
  @ApiOperation({ summary: 'Update lesson completion progress' })
  updateLessonProgress(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
    @Body() body: { isCompleted: boolean; lastPositionSeconds?: number },
    @CurrentUser() user: JwtPayload,
  ) {
    return this.enrollmentsService.updateLessonProgress(
      user.sub,
      courseId,
      lessonId,
      body.isCompleted,
      body.lastPositionSeconds,
    );
  }
}
