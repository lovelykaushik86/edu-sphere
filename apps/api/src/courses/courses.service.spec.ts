import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('CoursesService', () => {
  let service: CoursesService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      course: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      category: {
        findMany: jest.fn(),
        upsert: jest.fn(),
      },
      module: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
      lesson: {
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should query published courses', async () => {
      const mockList = [{ id: 'course-1', title: 'Angular for Beginners' }];
      prisma.course.findMany.mockResolvedValue(mockList);

      const result = await service.findAll();
      expect(result).toEqual(mockList);
      expect(prisma.course.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException when course is missing', async () => {
      prisma.course.findFirst.mockResolvedValue(null);
      await expect(service.findOne('invalid-slug')).rejects.toThrow(NotFoundException);
    });

    it('should return course when found', async () => {
      const course = { id: 'c1', slug: 'angular-for-beginners', title: 'Angular for Beginners' };
      prisma.course.findFirst.mockResolvedValue(course);

      const result = await service.findOne('angular-for-beginners');
      expect(result).toEqual(course);
    });
  });

  describe('create', () => {
    it('should throw ConflictException if slug exists', async () => {
      prisma.course.findUnique.mockResolvedValue({ id: 'c1', slug: 'angular-for-beginners' });
      await expect(
        service.create({
          title: 'Angular for Beginners',
          slug: 'angular-for-beginners',
          description: 'Desc',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
