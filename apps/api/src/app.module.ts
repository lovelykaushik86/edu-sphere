import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthController } from './health.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validationSchema: Joi.object({ DATABASE_URL: Joi.string().required(), JWT_ACCESS_SECRET: Joi.string().min(32).required(), JWT_REFRESH_SECRET: Joi.string().min(32).required() }) }), PrismaModule, AuthModule],
  controllers: [HealthController],
}) export class AppModule {}
