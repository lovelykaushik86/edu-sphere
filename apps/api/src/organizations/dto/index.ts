import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrgPlan, Role, SubscriptionStatus } from '@prisma/client';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'EduSphere Global Academy' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'edusphere-global' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ example: 'edusphere.edu' })
  @IsString()
  @IsOptional()
  domain?: string;

  @ApiPropertyOptional({ example: 'admin@edusphere.com' })
  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @ApiPropertyOptional({ example: '+61 2 9876 5432' })
  @IsString()
  @IsOptional()
  contactPhone?: string;

  @ApiPropertyOptional({ example: 'Level 14, 200 George Street' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'Sydney' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'Australia' })
  @IsString()
  @IsOptional()
  country?: string;
}

export class CreateBranchDto {
  @ApiProperty({ example: 'Sydney Central Campus' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'SYD-01' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiPropertyOptional({ example: '200 George Street' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'Sydney' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'Australia' })
  @IsString()
  @IsOptional()
  country?: string;
}

export class UpdateSubscriptionDto {
  @ApiPropertyOptional({ enum: OrgPlan, example: OrgPlan.PRO })
  @IsEnum(OrgPlan)
  @IsOptional()
  plan?: OrgPlan;

  @ApiPropertyOptional({ enum: SubscriptionStatus, example: SubscriptionStatus.ACTIVE })
  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status?: SubscriptionStatus;

  @ApiPropertyOptional({ example: 1000 })
  @IsInt()
  @IsOptional()
  maxUsers?: number;

  @ApiPropertyOptional({ example: 200 })
  @IsInt()
  @IsOptional()
  maxCourses?: number;
}

export class AddMemberDto {
  @ApiProperty({ example: 'user-id-cuid' })
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @ApiPropertyOptional({ enum: Role, example: Role.STUDENT })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiPropertyOptional({ example: 'branch-id-cuid' })
  @IsString()
  @IsOptional()
  branchId?: string;
}
