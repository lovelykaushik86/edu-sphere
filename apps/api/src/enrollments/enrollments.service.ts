import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EnrollmentStatus } from '@prisma/client';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async enroll(userId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { modules: { include: { lessons: true } } },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const existing = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (existing) {
      throw new ConflictException('Already enrolled in this course');
    }

    const firstLessonTitle = course.modules[0]?.lessons[0]?.title || 'Module 1: Introduction';

    const enrollment = await this.prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: EnrollmentStatus.ACTIVE,
        progressPercent: 0,
        currentLessonTitle: firstLessonTitle,
      },
      include: { course: true },
    });

    await this.prisma.course.update({
      where: { id: courseId },
      data: { enrolledCount: { increment: 1 } },
    });

    return enrollment;
  }

  async getUserEnrollments(userId: string) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            trainer: { select: { id: true, fullName: true, avatarUrl: true } },
            category: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getCourseProgress(userId: string, courseId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: {
        lessonProgress: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found for this course');
    }

    return enrollment;
  }

  async updateLessonProgress(
    userId: string,
    courseId: string,
    lessonId: string,
    isCompleted: boolean,
    lastPositionSeconds = 0,
  ) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: { course: { include: { modules: { include: { lessons: true } } } } },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment record not found');
    }

    await this.prisma.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId,
        },
      },
      update: {
        isCompleted,
        lastPositionSeconds,
        completedAt: isCompleted ? new Date() : null,
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId,
        isCompleted,
        lastPositionSeconds,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    // Calculate total lessons in course
    const allLessons = enrollment.course.modules.flatMap((m) => m.lessons);
    const totalLessons = allLessons.length;

    const completedProgress = await this.prisma.lessonProgress.count({
      where: {
        enrollmentId: enrollment.id,
        isCompleted: true,
      },
    });

    const newProgressPercent = totalLessons > 0 ? Math.round((completedProgress / totalLessons) * 100) : 0;
    const isNowCompleted = newProgressPercent >= 100;

    return this.prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progressPercent: newProgressPercent,
        status: isNowCompleted ? EnrollmentStatus.COMPLETED : EnrollmentStatus.ACTIVE,
        completedAt: isNowCompleted ? new Date() : enrollment.completedAt,
      },
      include: {
        lessonProgress: true,
      },
    });
  }
}
