import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class RolesPermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPermissions() {
    return this.prisma.permission.findMany({
      orderBy: [{ module: 'asc' }, { code: 'asc' }],
    });
  }

  async findPermissionsByRole(role: Role) {
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { role },
      include: { permission: true },
    });
    return rolePermissions.map((rp) => rp.permission);
  }

  async assignPermissionToRole(role: Role, permissionId: string) {
    const perm = await this.prisma.permission.findUnique({ where: { id: permissionId } });
    if (!perm) throw new NotFoundException('Permission not found');

    return this.prisma.rolePermission.upsert({
      where: {
        role_permissionId: { role, permissionId },
      },
      update: {},
      create: { role, permissionId },
      include: { permission: true },
    });
  }

  async removePermissionFromRole(role: Role, permissionId: string) {
    return this.prisma.rolePermission.deleteMany({
      where: { role, permissionId },
    });
  }

  async getUserPermissions(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (user.role === Role.SUPER_ADMIN) {
      return this.findAllPermissions();
    }

    return this.findPermissionsByRole(user.role);
  }
}
