import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwt: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      verificationToken: {
        create: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      refreshToken: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      auditLog: {
        create: jest.fn(),
      },
      loginHistory: {
        create: jest.fn(),
      },
    };

    jwt = {
      signAsync: jest.fn().mockResolvedValue('mock-token'),
      verifyAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw ConflictException if user already exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'test@example.com' });
      await expect(
        service.register({ email: 'test@example.com', fullName: 'Test', password: 'password123' }, {} as any),
      ).rejects.toThrow(ConflictException);
    });

    it('should create new user and verification token', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: 'user-1', email: 'new@example.com' });

      const result = await service.register(
        { email: 'new@example.com', fullName: 'New User', password: 'password123' },
        {} as any,
      );

      expect(result.message).toContain('Account created');
      expect(result.developmentVerificationUrl).toBeDefined();
      expect(prisma.verificationToken.create).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.login({ email: 'unknown@example.com', password: 'password' }, {} as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const hash = await bcrypt.hash('correct-password', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        passwordHash: hash,
        isEmailVerified: true,
      });

      await expect(
        service.login({ email: 'user@example.com', password: 'wrong-password' }, {} as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return tokens if credentials are valid and email verified', async () => {
      const hash = await bcrypt.hash('secret123', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'verified@example.com',
        fullName: 'Verified User',
        role: 'STUDENT',
        passwordHash: hash,
        isEmailVerified: true,
      });

      const result = await service.login({ email: 'verified@example.com', password: 'secret123' }, {} as any);
      expect(result.accessToken).toBe('mock-token');
      expect(result.refreshToken).toBe('mock-token');
      expect(result.user.email).toBe('verified@example.com');
    });
  });
});
