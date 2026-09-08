import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('System') @Controller({ path: 'health', version: '1' }) export class HealthController { @Get() get() { return { status: 'ok', service: 'edusphere-api', timestamp: new Date().toISOString() }; } }
