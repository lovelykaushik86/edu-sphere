import { Controller, Get } from '@nestjs/common';
@Controller('health') export class HealthController { @Get() get() { return { status: 'ok', service: 'edusphere-api', timestamp: new Date().toISOString() }; } }
