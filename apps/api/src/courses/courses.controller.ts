import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto, CreateCategoryDto, CreateModuleDto, CreateLessonDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CourseLevel, CourseStatus, Role } from '@prisma/client';

@ApiTags('Courses')
@Controller({ path: 'courses', version: '1' })
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get('categories')
  @ApiOperation({ summary: 'List all course categories' })
  getCategories() {
    return this.coursesService.findCategories();
  }

  @Post('categories')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new course category' })
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.coursesService.createCategory(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Search and list all published courses' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'level', required: false, enum: CourseLevel })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'featured', required: false, type: Boolean })
  findAll(
    @Query('category') categorySlug?: string,
    @Query('level') level?: CourseLevel,
    @Query('search') search?: string,
    @Query('featured') featured?: string,
  ) {
    return this.coursesService.findAll({
      categorySlug,
      level,
      search,
      featured: featured === 'true' ? true : undefined,
    });
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get course details with modules and lessons' })
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.coursesService.findOne(idOrSlug);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TRAINER)
  @ApiOperation({ summary: 'Create a new course' })
  create(@Body() dto: CreateCourseDto, @CurrentUser() user: JwtPayload) {
    return this.coursesService.create(dto, user?.sub);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TRAINER)
  @ApiOperation({ summary: 'Update course details' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateCourseDto>) {
    return this.coursesService.update(id, dto);
  }

  @Post(':id/modules')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TRAINER)
  @ApiOperation({ summary: 'Add a module to a course' })
  addModule(@Param('id') id: string, @Body() dto: CreateModuleDto) {
    return this.coursesService.addModule(id, dto);
  }

  @Post('modules/:moduleId/lessons')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TRAINER)
  @ApiOperation({ summary: 'Add a lesson to a module' })
  addLesson(@Param('moduleId') moduleId: string, @Body() dto: CreateLessonDto) {
    return this.coursesService.addLesson(moduleId, dto);
  }
}
