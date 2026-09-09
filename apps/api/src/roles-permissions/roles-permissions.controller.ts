import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesPermissionsService } from './roles-permissions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Role } from '@prisma/client';

@ApiTags('Roles & Permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'rbac', version: '1' })
export class RolesPermissionsController {
  constructor(private readonly rbacService: RolesPermissionsService) {}

  @Get('permissions')
  @ApiOperation({ summary: 'List all system permissions' })
  findAllPermissions() {
    return this.rbacService.findAllPermissions();
  }

  @Get('roles/:role/permissions')
  @ApiOperation({ summary: 'List permissions assigned to a role' })
  findPermissionsByRole(@Param('role') role: Role) {
    return this.rbacService.findPermissionsByRole(role);
  }

  @Post('roles/:role/permissions/:permissionId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Assign permission to a role' })
  assignPermission(
    @Param('role') role: Role,
    @Param('permissionId') permissionId: string,
  ) {
    return this.rbacService.assignPermissionToRole(role, permissionId);
  }

  @Delete('roles/:role/permissions/:permissionId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Remove permission from a role' })
  removePermission(
    @Param('role') role: Role,
    @Param('permissionId') permissionId: string,
  ) {
    return this.rbacService.removePermissionFromRole(role, permissionId);
  }

  @Get('my-permissions')
  @ApiOperation({ summary: 'Get current logged-in user permissions' })
  getMyPermissions(@CurrentUser() user: JwtPayload) {
    return this.rbacService.getUserPermissions(user.sub);
  }
}
