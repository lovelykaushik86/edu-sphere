import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto, CreateCategoryDto, CreateModuleDto, CreateLessonDto } from './dto';
import { CourseLevel, CourseStatus } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async findCategories() {
    return this.prisma.category.findMany({
      include: {
        _count: { select: { courses: true } },
      },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async createCategory(dto: CreateCategoryDto) {
    const slug = dto.slug || dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return this.prisma.category.upsert({
      where: { slug },
      update: {},
      create: {
        name: dto.name,
        slug,
        icon: dto.icon,
        description: dto.description,
      },
    });
  }

  async findAll(query?: {
    categorySlug?: string;
    level?: CourseLevel;
    search?: string;
    featured?: boolean;
    status?: CourseStatus;
  }) {
    const where: any = {
      status: query?.status || CourseStatus.PUBLISHED,
    };

    if (query?.categorySlug) {
      where.category = { slug: query.categorySlug };
    }

    if (query?.level) {
      where.level = query.level;
    }

    if (query?.featured !== undefined) {
      where.isFeatured = query.featured;
    }

    if (query?.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.course.findMany({
      where,
      include: {
        category: true,
        trainer: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        _count: {
          select: {
            modules: true,
            enrollments: true,
          },
        },
      },
      orderBy: [{ isFeatured: 'desc' }, { rating: 'desc' }],
    });
  }

  async findOne(idOrSlug: string) {
    const course = await this.prisma.course.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        category: true,
        trainer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            bio: true,
            avatarUrl: true,
          },
        },
        modules: {
          orderBy: { orderIndex: 'asc' },
          include: {
            lessons: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
        assignments: true,
        resources: true,
        _count: {
          select: {
            enrollments: true,
            modules: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course '${idOrSlug}' not found`);
    }

    return course;
  }

  async create(dto: CreateCourseDto, trainerId?: string) {
    const slug = dto.slug || dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await this.prisma.course.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException(`Course with slug '${slug}' already exists`);
    }

    return this.prisma.course.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description,
        shortDescription: dto.shortDescription,
        categoryId: dto.categoryId,
        level: dto.level || CourseLevel.BEGINNER,
        status: dto.status || CourseStatus.PUBLISHED,
        iconText: dto.iconText || 'A',
        colorScheme: dto.colorScheme || 'navy',
        badge: dto.badge,
        durationHours: dto.durationHours || 10,
        isFeatured: dto.isFeatured ?? false,
        trainerId,
      },
      include: {
        category: true,
        modules: true,
      },
    });
  }

  async update(id: string, dto: Partial<CreateCourseDto>) {
    await this.findOne(id);
    return this.prisma.course.update({
      where: { id },
      data: dto,
    });
  }

  async addModule(courseId: string, dto: CreateModuleDto) {
    await this.findOne(courseId);
    return this.prisma.module.create({
      data: {
        courseId,
        title: dto.title,
        description: dto.description,
        orderIndex: dto.orderIndex || 1,
        durationMinutes: dto.durationMinutes || 60,
      },
    });
  }

  async addLesson(moduleId: string, dto: CreateLessonDto) {
    const moduleItem = await this.prisma.module.findUnique({ where: { id: moduleId } });
    if (!moduleItem) throw new NotFoundException('Module not found');

    return this.prisma.lesson.create({
      data: {
        moduleId,
        title: dto.title,
        description: dto.description,
        orderIndex: dto.orderIndex || 1,
        type: dto.type,
        durationMinutes: dto.durationMinutes || 15,
        videoUrl: dto.videoUrl,
        isFreePreview: dto.isFreePreview || false,
      },
    });
  }
}
