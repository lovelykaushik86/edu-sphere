import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CourseLevel, CourseStatus, LessonType } from '@prisma/client';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Web Development' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'web-development' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ example: 'code' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ example: 'Modern Web development courses' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateCourseDto {
  @ApiProperty({ example: 'Angular for Beginners' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: 'angular-for-beginners' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ example: 'Learn Angular from scratch and build modern web applications.' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiPropertyOptional({ example: 'Master Angular 20 components, signals, and routing.' })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiPropertyOptional({ example: 'category-cuid' })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ enum: CourseLevel, example: CourseLevel.BEGINNER })
  @IsEnum(CourseLevel)
  @IsOptional()
  level?: CourseLevel;

  @ApiPropertyOptional({ enum: CourseStatus, example: CourseStatus.PUBLISHED })
  @IsEnum(CourseStatus)
  @IsOptional()
  status?: CourseStatus;

  @ApiPropertyOptional({ example: 'A' })
  @IsString()
  @IsOptional()
  iconText?: string;

  @ApiPropertyOptional({ example: 'red' })
  @IsString()
  @IsOptional()
  colorScheme?: string;

  @ApiPropertyOptional({ example: 'Beginner' })
  @IsString()
  @IsOptional()
  badge?: string;

  @ApiPropertyOptional({ example: 13 })
  @IsInt()
  @IsOptional()
  durationHours?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}

export class CreateModuleDto {
  @ApiProperty({ example: 'Module 1: Introduction' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: 'Core introduction and architecture' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  orderIndex?: number;

  @ApiPropertyOptional({ example: 45 })
  @IsInt()
  @IsOptional()
  durationMinutes?: number;
}

export class CreateLessonDto {
  @ApiProperty({ example: '3.1 Understanding Components' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: 'Learn how Angular components work with templates and signals' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  orderIndex?: number;

  @ApiPropertyOptional({ enum: LessonType, example: LessonType.VIDEO })
  @IsEnum(LessonType)
  @IsOptional()
  type?: LessonType;

  @ApiPropertyOptional({ example: 15 })
  @IsInt()
  @IsOptional()
  durationMinutes?: number;

  @ApiPropertyOptional({ example: 'https://cdn.edusphere.io/videos/sample.mp4' })
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isFreePreview?: boolean;
}
