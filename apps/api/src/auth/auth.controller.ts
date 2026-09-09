import { Body, Controller, Get, HttpCode, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, LoginDto, RefreshDto, RegisterDto, ResetPasswordDto } from './dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles, RolesGuard } from './roles.guard';
import { Role } from '@prisma/client';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Post('register') register(@Body() body: RegisterDto, @Req() req: Request) { return this.auth.register(body, req); }
  @Post('login') @HttpCode(200) login(@Body() body: LoginDto, @Req() req: Request) { return this.auth.login(body, req); }
  @Post('refresh') @HttpCode(200) refresh(@Body() body: RefreshDto) { return this.auth.refresh(body.refreshToken); }
  @Post('logout') @HttpCode(204) logout(@Body() body: RefreshDto) { return this.auth.logout(body.refreshToken); }
  @Post('forgot-password') @HttpCode(200) forgot(@Body() body: ForgotPasswordDto) { return this.auth.forgotPassword(body.email); }
  @Post('reset-password') @HttpCode(204) reset(@Body() body: ResetPasswordDto) { return this.auth.resetPassword(body); }
  @Get('verify-email') verify(@Query('token') token: string) { return this.auth.verifyEmail(token); }
  @Get('me') @UseGuards(JwtAuthGuard) me(@CurrentUser() user: JwtPayload) { return this.auth.me(user.sub); }
  @Get('login-history') @UseGuards(JwtAuthGuard) history(@CurrentUser() user: JwtPayload) { return this.auth.loginHistory(user.sub); }
  @Get('admin/health') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN, Role.SUPER_ADMIN) adminHealth() { return { status: 'ok', scope: 'admin' }; }
}
