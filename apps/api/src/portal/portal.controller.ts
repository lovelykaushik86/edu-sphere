import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PortalService } from './portal.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Portal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'portal', version: '1' })
export class PortalController {
  constructor(private readonly portalService: PortalService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get unified student dashboard data matching design' })
  getDashboard(@CurrentUser() user: JwtPayload) {
    return this.portalService.getDashboard(user.sub);
  }

  @Get('notifications')
  @ApiOperation({ summary: 'Get user notifications and unread count' })
  getNotifications(@CurrentUser() user: JwtPayload) {
    return this.portalService.getNotifications(user.sub);
  }

  @Post('notifications/:id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  markNotificationRead(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.portalService.markNotificationRead(id, user.sub);
  }

  @Post('notifications/read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllNotificationsRead(@CurrentUser() user: JwtPayload) {
    return this.portalService.markAllNotificationsRead(user.sub);
  }

  @Get('certificates')
  @ApiOperation({ summary: 'Get student certificates' })
  getCertificates(@CurrentUser() user: JwtPayload) {
    return this.portalService.getCertificates(user.sub);
  }

  @Get('messages')
  @ApiOperation({ summary: 'Get user conversations and chats' })
  getMessages(@CurrentUser() user: JwtPayload) {
    return this.portalService.getMessages(user.sub);
  }

  @Post('messages')
  @ApiOperation({ summary: 'Send a chat message' })
  sendMessage(
    @CurrentUser() user: JwtPayload,
    @Body() body: { receiverId: string; content: string },
  ) {
    return this.portalService.sendMessage(user.sub, body.receiverId, body.content);
  }

  @Get('calendar')
  @ApiOperation({ summary: 'Get user calendar events' })
  getCalendar(@CurrentUser() user: JwtPayload) {
    return this.portalService.getCalendarEvents(user.sub);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update user profile (personal information)' })
  updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() body: { fullName?: string; phoneNumber?: string; location?: string; bio?: string; avatarUrl?: string },
  ) {
    return this.portalService.updateProfile(user.sub, body);
  }
}
