import { Test, TestingModule } from '@nestjs/testing';
import { PortalService } from './portal.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('PortalService', () => {
  let service: PortalService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      enrollment: {
        findMany: jest.fn(),
      },
      certificate: {
        findMany: jest.fn(),
      },
      course: {
        findMany: jest.fn(),
      },
      calendarEvent: {
        findMany: jest.fn(),
      },
      notification: {
        findMany: jest.fn(),
        count: jest.fn(),
        updateMany: jest.fn(),
      },
      chatMessage: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortalService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PortalService>(PortalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDashboard', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.getDashboard('missing-id')).rejects.toThrow(NotFoundException);
    });

    it('should return unified dashboard data matching design metrics', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'u1', fullName: 'Alex Johnson', role: 'STUDENT' });
      prisma.enrollment.findMany.mockResolvedValue([
        {
          courseId: 'c1',
          status: 'ACTIVE',
          progressPercent: 60,
          currentLessonTitle: 'Module 3: Components and Data Binding',
          course: { slug: 'angular-for-beginners', title: 'Angular for Beginners', colorScheme: 'red', iconText: 'A' },
        },
      ]);
      prisma.certificate.findMany.mockResolvedValue([{ id: 'cert-1' }]);
      prisma.course.findMany.mockResolvedValue([
        { id: 'c2', title: 'Node.js APIs', rating: 4.8, reviewsCount: 1200 },
      ]);
      prisma.calendarEvent.findMany.mockResolvedValue([
        { id: 'ev-1', title: 'Assignment 3', startDate: new Date('2025-04-10') },
      ]);

      const data = await service.getDashboard('u1');
      expect(data.user.fullName).toBe('Alex Johnson');
      expect(data.stats.enrolledCourses).toBe(1);
      expect(data.stats.inProgress).toBe(1);
      expect(data.continueLearning?.progressPercent).toBe(60);
      expect(data.recommendedCourses.length).toBe(1);
      expect(data.upcomingDeadlines.length).toBe(1);
    });
  });
});
