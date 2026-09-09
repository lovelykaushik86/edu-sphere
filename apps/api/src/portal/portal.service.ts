import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EnrollmentStatus } from '@prisma/client';

@Injectable()
export class PortalService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, fullName: true, email: true, role: true, avatarUrl: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Enrollments
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            trainer: { select: { fullName: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const enrolledCount = enrollments.length;
    const inProgressCount = enrollments.filter((e) => e.status === EnrollmentStatus.ACTIVE && e.progressPercent > 0).length;
    const completedCount = enrollments.filter((e) => e.status === EnrollmentStatus.COMPLETED).length;
    const notStartedCount = enrollments.filter((e) => e.status === EnrollmentStatus.ACTIVE && e.progressPercent === 0).length;

    // Certificates
    const certificates = await this.prisma.certificate.findMany({
      where: { userId },
      include: { course: true },
      orderBy: { issuedAt: 'desc' },
    });

    // Continue Learning Course (first active with highest progress or most recent)
    const continueEnrollment = enrollments.find((e) => e.status === EnrollmentStatus.ACTIVE) || enrollments[0];
    const continueLearning = continueEnrollment
      ? {
          courseId: continueEnrollment.courseId,
          slug: continueEnrollment.course.slug,
          title: continueEnrollment.course.title,
          currentModule: continueEnrollment.currentLessonTitle || 'Module 3: Components and Data Binding',
          progressPercent: continueEnrollment.progressPercent,
          colorScheme: continueEnrollment.course.colorScheme,
          iconText: continueEnrollment.course.iconText,
        }
      : null;

    // Recommended Courses
    const recommendedCourses = await this.prisma.course.findMany({
      where: {
        id: { notIn: enrollments.map((e) => e.courseId) },
        status: 'PUBLISHED',
      },
      take: 3,
      orderBy: { rating: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        rating: true,
        reviewsCount: true,
        colorScheme: true,
        iconText: true,
      },
    });

    // Overall Progress
    const totalPossible = enrolledCount * 100;
    const currentSum = enrollments.reduce((sum, e) => sum + e.progressPercent, 0);
    const overallProgress = totalPossible > 0 ? Math.round((currentSum / totalPossible) * 100) : 0;

    // Upcoming Deadlines (from calendar events or assignments)
    const upcomingDeadlines = await this.prisma.calendarEvent.findMany({
      where: {
        userId,
        startDate: { gte: new Date('2025-01-01') },
      },
      take: 5,
      orderBy: { startDate: 'asc' },
      include: { course: { select: { title: true } } },
    });

    return {
      user,
      stats: {
        enrolledCourses: enrolledCount,
        inProgress: inProgressCount,
        completed: completedCount,
        certificates: certificates.length,
      },
      continueLearning,
      recommendedCourses,
      progressCard: {
        overallProgress,
        inProgress: inProgressCount,
        completed: completedCount,
        notStarted: notStartedCount,
      },
      upcomingDeadlines: upcomingDeadlines.map((d) => ({
        id: d.id,
        title: d.title,
        eventType: d.eventType,
        courseTitle: d.course?.title,
        dueDate: d.startDate,
      })),
    };
  }

  async getNotifications(userId: string) {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    const unreadCount = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { notifications, unreadCount };
  }

  async markNotificationRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllNotificationsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async getCertificates(userId: string) {
    return this.prisma.certificate.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            title: true,
            slug: true,
            level: true,
            durationHours: true,
          },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async getMessages(userId: string) {
    // Return unique conversation partners
    const sent = await this.prisma.chatMessage.findMany({
      where: { senderId: userId },
      include: { receiver: { select: { id: true, fullName: true, role: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });
    const received = await this.prisma.chatMessage.findMany({
      where: { receiverId: userId },
      include: { sender: { select: { id: true, fullName: true, role: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const contactsMap = new Map<string, any>();

    for (const msg of received) {
      if (!contactsMap.has(msg.sender.id)) {
        contactsMap.set(msg.sender.id, {
          contact: msg.sender,
          lastMessage: msg.content,
          timestamp: msg.createdAt,
          unread: !msg.isRead,
        });
      }
    }

    for (const msg of sent) {
      if (!contactsMap.has(msg.receiver.id)) {
        contactsMap.set(msg.receiver.id, {
          contact: msg.receiver,
          lastMessage: `You: ${msg.content}`,
          timestamp: msg.createdAt,
          unread: false,
        });
      }
    }

    return Array.from(contactsMap.values());
  }

  async sendMessage(senderId: string, receiverId: string, content: string) {
    return this.prisma.chatMessage.create({
      data: {
        senderId,
        receiverId,
        content,
      },
    });
  }

  async getCalendarEvents(userId: string) {
    return this.prisma.calendarEvent.findMany({
      where: {
        OR: [{ userId }, { userId: null }],
      },
      include: {
        course: { select: { title: true, slug: true } },
      },
      orderBy: { startDate: 'asc' },
    });
  }

  async updateProfile(
    userId: string,
    data: { fullName?: string; phoneNumber?: string; location?: string; bio?: string; avatarUrl?: string },
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        phoneNumber: true,
        location: true,
        bio: true,
        avatarUrl: true,
        updatedAt: true,
      },
    });
  }
}
