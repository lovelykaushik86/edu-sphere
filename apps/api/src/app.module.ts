import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthController } from './health.controller';
import { OrganizationsModule } from './organizations/organizations.module';
import { RolesPermissionsModule } from './roles-permissions/roles-permissions.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { PortalModule } from './portal/portal.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [process.env.ENV_FILE ?? '.env', 'env/.env.local', 'env/.env.local.example'],
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().min(16).required(),
        JWT_REFRESH_SECRET: Joi.string().min(16).required(),
      }),
    }),
    PrismaModule,
    AuthModule,
    OrganizationsModule,
    RolesPermissionsModule,
    CoursesModule,
    EnrollmentsModule,
    PortalModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

