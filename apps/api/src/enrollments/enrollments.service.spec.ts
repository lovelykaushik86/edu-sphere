import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentsService } from './enrollments.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      course: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      enrollment: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      lessonProgress: {
        upsert: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<EnrollmentsService>(EnrollmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('enroll', () => {
    it('should throw NotFoundException if course does not exist', async () => {
      prisma.course.findUnique.mockResolvedValue(null);
      await expect(service.enroll('user-1', 'invalid-course')).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if already enrolled', async () => {
      prisma.course.findUnique.mockResolvedValue({ id: 'course-1', modules: [] });
      prisma.enrollment.findUnique.mockResolvedValue({ id: 'enr-1' });

      await expect(service.enroll('user-1', 'course-1')).rejects.toThrow(ConflictException);
    });

    it('should successfully enroll student', async () => {
      prisma.course.findUnique.mockResolvedValue({
        id: 'c1',
        modules: [{ lessons: [{ title: 'Lesson 1' }] }],
      });
      prisma.enrollment.findUnique.mockResolvedValue(null);
      prisma.enrollment.create.mockResolvedValue({ id: 'enr-new', progressPercent: 0 });

      const res = await service.enroll('u1', 'c1');
      expect(res.id).toBe('enr-new');
      expect(prisma.course.update).toHaveBeenCalled();
    });
  });
});
