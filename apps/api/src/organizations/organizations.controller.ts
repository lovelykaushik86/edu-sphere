import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto, CreateBranchDto, UpdateSubscriptionDto, AddMemberDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Role } from '@prisma/client';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'organizations', version: '1' })
export class OrganizationsController {
  constructor(private readonly orgService: OrganizationsService) {}

  @Get()
  @ApiOperation({ summary: 'List all organizations' })
  findAll() {
    return this.orgService.findAll();
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get organization details by ID or slug' })
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.orgService.findOne(idOrSlug);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new organization' })
  create(@Body() dto: CreateOrganizationDto, @CurrentUser() user: JwtPayload) {
    return this.orgService.create(dto, user?.sub);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Update organization details' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateOrganizationDto>) {
    return this.orgService.update(id, dto);
  }

  @Get(':id/branches')
  @ApiOperation({ summary: 'List branches for an organization' })
  getBranches(@Param('id') id: string) {
    return this.orgService.getBranches(id);
  }

  @Post(':id/branches')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Create a branch for an organization' })
  createBranch(@Param('id') id: string, @Body() dto: CreateBranchDto) {
    return this.orgService.createBranch(id, dto);
  }

  @Get(':id/subscription')
  @ApiOperation({ summary: 'Get subscription details for an organization' })
  getSubscription(@Param('id') id: string) {
    return this.orgService.getSubscription(id);
  }

  @Patch(':id/subscription')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Update subscription details for an organization' })
  updateSubscription(@Param('id') id: string, @Body() dto: UpdateSubscriptionDto) {
    return this.orgService.updateSubscription(id, dto);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get members of an organization' })
  getMembers(@Param('id') id: string) {
    return this.orgService.getMembers(id);
  }

  @Post(':id/members')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Add a user to an organization' })
  addMember(@Param('id') id: string, @Body() dto: AddMemberDto) {
    return this.orgService.addMember(id, dto);
  }
}
