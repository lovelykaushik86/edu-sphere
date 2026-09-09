import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto, CreateBranchDto, UpdateSubscriptionDto, AddMemberDto } from './dto';
import { AuditAction, OrgPlan, Role, SubscriptionStatus } from '@prisma/client';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.organization.findMany({
      include: {
        subscription: true,
        _count: {
          select: {
            branches: true,
            members: true,
            courses: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(idOrSlug: string) {
    const org = await this.prisma.organization.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        branches: true,
        subscription: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                avatarUrl: true,
              },
            },
            branch: true,
          },
        },
        _count: {
          select: { courses: true },
        },
      },
    });

    if (!org) {
      throw new NotFoundException(`Organization '${idOrSlug}' not found`);
    }

    return org;
  }

  async create(dto: CreateOrganizationDto, creatorUserId?: string) {
    const slug = dto.slug || dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await this.prisma.organization.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException(`An organization with slug '${slug}' already exists`);
    }

    const org = await this.prisma.organization.create({
      data: {
        name: dto.name,
        slug,
        domain: dto.domain,
        contactEmail: dto.contactEmail,
        contactPhone: dto.contactPhone,
        address: dto.address,
        city: dto.city,
        country: dto.country || 'Australia',
        subscription: {
          create: {
            plan: OrgPlan.PRO,
            status: SubscriptionStatus.ACTIVE,
            maxUsers: 500,
            maxCourses: 100,
            maxStorageGB: 50,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 365 * 86400000),
          },
        },
        ...(creatorUserId
          ? {
              members: {
                create: {
                  userId: creatorUserId,
                  role: Role.ADMIN,
                },
              },
            }
          : {}),
      },
      include: { subscription: true },
    });

    if (creatorUserId) {
      await this.prisma.auditLog.create({
        data: {
          action: AuditAction.ORG_CREATED,
          userId: creatorUserId,
          metadata: { organizationId: org.id, name: org.name },
        },
      });
    }

    return org;
  }

  async update(id: string, dto: Partial<CreateOrganizationDto>) {
    await this.findOne(id);
    return this.prisma.organization.update({
      where: { id },
      data: dto,
      include: { subscription: true },
    });
  }

  async getBranches(organizationId: string) {
    return this.prisma.branch.findMany({
      where: { organizationId },
      include: {
        _count: { select: { members: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async createBranch(organizationId: string, dto: CreateBranchDto) {
    await this.findOne(organizationId);
    return this.prisma.branch.create({
      data: {
        organizationId,
        name: dto.name,
        code: dto.code,
        address: dto.address,
        city: dto.city,
        country: dto.country || 'Australia',
      },
    });
  }

  async getSubscription(organizationId: string) {
    const sub = await this.prisma.subscription.findUnique({
      where: { organizationId },
    });
    if (!sub) {
      throw new NotFoundException(`No subscription found for organization ${organizationId}`);
    }
    return sub;
  }

  async updateSubscription(organizationId: string, dto: UpdateSubscriptionDto) {
    return this.prisma.subscription.update({
      where: { organizationId },
      data: dto,
    });
  }

  async getMembers(organizationId: string) {
    return this.prisma.userOrganization.findMany({
      where: { organizationId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            avatarUrl: true,
            lastLoginAt: true,
          },
        },
        branch: true,
      },
      orderBy: { joinedAt: 'desc' },
    });
  }

  async addMember(organizationId: string, dto: AddMemberDto) {
    const existing = await this.prisma.userOrganization.findUnique({
      where: {
        userId_organizationId: {
          userId: dto.userId,
          organizationId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('User is already a member of this organization');
    }

    return this.prisma.userOrganization.create({
      data: {
        organizationId,
        userId: dto.userId,
        branchId: dto.branchId,
        role: dto.role || Role.STUDENT,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
        branch: true,
      },
    });
  }
}
