import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsService } from './organizations.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('OrganizationsService', () => {
  let service: OrganizationsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      organization: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      branch: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
      subscription: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      userOrganization: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      auditLog: {
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should throw NotFoundException if organization does not exist', async () => {
      prisma.organization.findFirst.mockResolvedValue(null);
      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should return organization when found', async () => {
      const mockOrg = { id: 'org-1', name: 'Academy', slug: 'academy' };
      prisma.organization.findFirst.mockResolvedValue(mockOrg);
      const result = await service.findOne('academy');
      expect(result).toEqual(mockOrg);
    });
  });

  describe('create', () => {
    it('should throw ConflictException if slug already exists', async () => {
      prisma.organization.findUnique.mockResolvedValue({ id: 'org-1', slug: 'test-org' });
      await expect(
        service.create({ name: 'Test Org', slug: 'test-org' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create organization with subscription', async () => {
      prisma.organization.findUnique.mockResolvedValue(null);
      const created = { id: 'org-1', name: 'New Org', slug: 'new-org' };
      prisma.organization.create.mockResolvedValue(created);

      const result = await service.create({ name: 'New Org' });
      expect(result).toEqual(created);
      expect(prisma.organization.create).toHaveBeenCalled();
    });
  });
});
