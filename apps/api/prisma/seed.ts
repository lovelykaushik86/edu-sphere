import { PrismaClient, Role, OrgPlan, SubscriptionStatus, CourseLevel, CourseStatus, LessonType, EnrollmentStatus, NotificationType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding EduSphere LMS database for Sprint 2 & Sprint 3...');

  // 1. Password Hash for test users
  const defaultPasswordHash = await bcrypt.hash('Password123!', 12);

  // 2. Permissions
  const permissionData = [
    { code: 'org:read', name: 'Read Organization', module: 'Organization', description: 'View organization details' },
    { code: 'org:update', name: 'Update Organization', module: 'Organization', description: 'Modify organization settings' },
    { code: 'branch:manage', name: 'Manage Branches', module: 'Organization', description: 'Create and update branches' },
    { code: 'course:create', name: 'Create Course', module: 'Course', description: 'Create new course curriculum' },
    { code: 'course:update', name: 'Update Course', module: 'Course', description: 'Edit course content and modules' },
    { code: 'course:publish', name: 'Publish Course', module: 'Course', description: 'Publish course to student catalog' },
    { code: 'course:read', name: 'Read Courses', module: 'Course', description: 'View courses and lessons' },
    { code: 'student:enroll', name: 'Enroll in Course', module: 'Student', description: 'Enroll into learning courses' },
    { code: 'student:manage', name: 'Manage Students', module: 'Student', description: 'View and manage student records' },
    { code: 'assessment:grade', name: 'Grade Assessments', module: 'Assessment', description: 'Evaluate assignments and quizzes' },
    { code: 'report:view', name: 'View Reports', module: 'Report', description: 'View analytics and reports' },
    { code: 'user:manage', name: 'Manage Users', module: 'User', description: 'Manage users and roles' },
  ];

  for (const perm of permissionData) {
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: {},
      create: perm,
    });
  }

  // Map permissions to roles
  const allPermissions = await prisma.permission.findMany();
  for (const perm of allPermissions) {
    // Super admin has all
    await prisma.rolePermission.upsert({
      where: { role_permissionId: { role: Role.SUPER_ADMIN, permissionId: perm.id } },
      update: {},
      create: { role: Role.SUPER_ADMIN, permissionId: perm.id },
    });

    // Admin has all except root system manage
    await prisma.rolePermission.upsert({
      where: { role_permissionId: { role: Role.ADMIN, permissionId: perm.id } },
      update: {},
      create: { role: Role.ADMIN, permissionId: perm.id },
    });

    // Trainer permissions
    if (['course:create', 'course:update', 'course:read', 'student:manage', 'assessment:grade', 'report:view'].includes(perm.code)) {
      await prisma.rolePermission.upsert({
        where: { role_permissionId: { role: Role.TRAINER, permissionId: perm.id } },
        update: {},
        create: { role: Role.TRAINER, permissionId: perm.id },
      });
    }

    // Student permissions
    if (['course:read', 'student:enroll'].includes(perm.code)) {
      await prisma.rolePermission.upsert({
        where: { role_permissionId: { role: Role.STUDENT, permissionId: perm.id } },
        update: {},
        create: { role: Role.STUDENT, permissionId: perm.id },
      });
    }
  }

  // 3. Organization & Branches
  const organization = await prisma.organization.upsert({
    where: { slug: 'edusphere-global' },
    update: {},
    create: {
      name: 'EduSphere Global Academy',
      slug: 'edusphere-global',
      domain: 'edusphere.edu',
      contactEmail: 'admin@edusphere.com',
      contactPhone: '+61 2 9876 5432',
      address: 'Level 14, 200 George Street',
      city: 'Sydney',
      country: 'Australia',
      branches: {
        create: [
          { name: 'Sydney Central Campus', code: 'SYD-01', address: '200 George Street', city: 'Sydney', country: 'Australia' },
          { name: 'New York Campus', code: 'NYC-01', address: '550 5th Avenue', city: 'New York', country: 'USA' },
          { name: 'Melbourne Tech Hub', code: 'MEL-02', address: '120 Collins Street', city: 'Melbourne', country: 'Australia' },
        ],
      },
      subscription: {
        create: {
          plan: OrgPlan.PRO,
          status: SubscriptionStatus.ACTIVE,
          maxUsers: 1000,
          maxCourses: 200,
          maxStorageGB: 100,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 365 * 86400000),
        },
      },
    },
    include: { branches: true },
  });

  const nycBranch = organization.branches.find((b) => b.code === 'NYC-01');
  const sydBranch = organization.branches.find((b) => b.code === 'SYD-01');

  // 4. Users (Students, Trainers, Admins)
  const alexUser = await prisma.user.upsert({
    where: { email: 'alex@example.com' },
    update: {},
    create: {
      email: 'alex@example.com',
      fullName: 'Alex Johnson',
      passwordHash: defaultPasswordHash,
      role: Role.STUDENT,
      isEmailVerified: true,
      phoneNumber: '+1 234 567 8900',
      location: 'New York, USA',
      bio: 'Passionate about learning new technologies and building amazing products.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      memberships: {
        create: {
          organizationId: organization.id,
          branchId: nycBranch?.id,
          role: Role.STUDENT,
        },
      },
    },
  });

  const sarahTrainer = await prisma.user.upsert({
    where: { email: 'sarah.wilson@edusphere.com' },
    update: {},
    create: {
      email: 'sarah.wilson@edusphere.com',
      fullName: 'Sarah Wilson',
      passwordHash: defaultPasswordHash,
      role: Role.TRAINER,
      isEmailVerified: true,
      phoneNumber: '+61 412 345 678',
      location: 'Sydney, Australia',
      bio: 'Lead Web Architect and Angular Google Developer Expert with 10+ years teaching experience.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
      memberships: {
        create: {
          organizationId: organization.id,
          branchId: sydBranch?.id,
          role: Role.TRAINER,
        },
      },
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@edusphere.com' },
    update: {},
    create: {
      email: 'admin@edusphere.com',
      fullName: 'Elena Rostova',
      passwordHash: defaultPasswordHash,
      role: Role.ADMIN,
      isEmailVerified: true,
      location: 'Sydney, Australia',
      memberships: {
        create: {
          organizationId: organization.id,
          role: Role.ADMIN,
        },
      },
    },
  });

  const jamesStudent = await prisma.user.upsert({
    where: { email: 'james.carter@example.com' },
    update: {},
    create: {
      email: 'james.carter@example.com',
      fullName: 'James Carter',
      passwordHash: defaultPasswordHash,
      role: Role.STUDENT,
      isEmailVerified: true,
      location: 'London, UK',
    },
  });

  const emilyStudent = await prisma.user.upsert({
    where: { email: 'emily.davis@example.com' },
    update: {},
    create: {
      email: 'emily.davis@example.com',
      fullName: 'Emily Davis',
      passwordHash: defaultPasswordHash,
      role: Role.STUDENT,
      isEmailVerified: true,
      location: 'San Francisco, USA',
    },
  });

  // 5. Categories
  const webCat = await prisma.category.upsert({
    where: { slug: 'web-development' },
    update: {},
    create: { name: 'Web Development', slug: 'web-development', icon: 'code', description: 'Modern Frontend and Backend Web Technologies' },
  });

  const cloudCat = await prisma.category.upsert({
    where: { slug: 'cloud-computing' },
    update: {},
    create: { name: 'Cloud Computing', slug: 'cloud-computing', icon: 'cloud', description: 'AWS, Azure, Microservices and DevOps' },
  });

  const designCat = await prisma.category.upsert({
    where: { slug: 'ui-ux-design' },
    update: {},
    create: { name: 'UI/UX Design', slug: 'ui-ux-design', icon: 'palette', description: 'Interface design, Figma and User Experience Research' },
  });

  // 6. Courses & Curriculum
  // Course 1: Angular for Beginners (Matches Design!)
  const angularCourse = await prisma.course.upsert({
    where: { slug: 'angular-for-beginners' },
    update: {},
    create: {
      title: 'Angular for Beginners',
      slug: 'angular-for-beginners',
      description: 'Learn Angular from scratch and build modern web applications with hands-on projects.',
      shortDescription: 'Master Angular 20 components, signals, dependency injection, and modern routing.',
      categoryId: webCat.id,
      organizationId: organization.id,
      trainerId: sarahTrainer.id,
      level: CourseLevel.BEGINNER,
      status: CourseStatus.PUBLISHED,
      badge: 'Beginner',
      iconText: 'A',
      colorScheme: 'red',
      durationHours: 13,
      rating: 4.8,
      reviewsCount: 1200,
      enrolledCount: 3420,
      isFeatured: true,
      modules: {
        create: [
          {
            title: 'Module 1: Introduction',
            orderIndex: 1,
            durationMinutes: 45,
            lessons: {
              create: [
                { title: '3.1 Introduction to Modern Web and SPA', orderIndex: 1, type: LessonType.VIDEO, durationMinutes: 15, isFreePreview: true },
                { title: '3.2 Angular Architecture and Tooling', orderIndex: 2, type: LessonType.VIDEO, durationMinutes: 15 },
                { title: '3.3 Creating Your First Angular Project', orderIndex: 3, type: LessonType.TEXT, durationMinutes: 15 },
              ],
            },
          },
          {
            title: 'Module 2: Setting up the Environment',
            orderIndex: 2,
            durationMinutes: 60,
            lessons: {
              create: [
                { title: 'Node.js, npm and CLI Installation', orderIndex: 1, type: LessonType.VIDEO, durationMinutes: 15 },
                { title: 'VS Code Extensions & DevTools setup', orderIndex: 2, type: LessonType.VIDEO, durationMinutes: 15 },
                { title: 'Project Structure Deep Dive', orderIndex: 3, type: LessonType.TEXT, durationMinutes: 15 },
                { title: 'Hot Module Reloading and Dev Server', orderIndex: 4, type: LessonType.VIDEO, durationMinutes: 15 },
              ],
            },
          },
          {
            title: 'Module 3: Components and Data Binding',
            orderIndex: 3,
            durationMinutes: 90,
            lessons: {
              create: [
                { title: '3.1 Understanding Components', orderIndex: 1, type: LessonType.VIDEO, durationMinutes: 15 },
                { title: '3.2 Component Interaction', orderIndex: 2, type: LessonType.VIDEO, durationMinutes: 20 },
                { title: '3.3 Data Binding', orderIndex: 3, type: LessonType.VIDEO, durationMinutes: 25 },
                { title: '3.4 Event Handling', orderIndex: 4, type: LessonType.VIDEO, durationMinutes: 20 },
                { title: '3.5 Quiz: Components', orderIndex: 5, type: LessonType.QUIZ, durationMinutes: 10 },
              ],
            },
          },
          {
            title: 'Module 4: Directives',
            orderIndex: 4,
            durationMinutes: 60,
            lessons: {
              create: [
                { title: 'Built-in Control Flow (@if, @for, @switch)', orderIndex: 1, type: LessonType.VIDEO, durationMinutes: 15 },
                { title: 'Attribute Directives (ngClass, ngStyle)', orderIndex: 2, type: LessonType.VIDEO, durationMinutes: 15 },
                { title: 'Building Custom Structural Directives', orderIndex: 3, type: LessonType.VIDEO, durationMinutes: 15 },
                { title: 'Directive Host Listeners & Bindings', orderIndex: 4, type: LessonType.VIDEO, durationMinutes: 15 },
              ],
            },
          },
          {
            title: 'Module 5: Services and Dependency Injection',
            orderIndex: 5,
            durationMinutes: 90,
            lessons: {
              create: [
                { title: 'Introduction to Services & Inversion of Control', orderIndex: 1, type: LessonType.VIDEO, durationMinutes: 20 },
                { title: 'Dependency Injection Hierarchies', orderIndex: 2, type: LessonType.VIDEO, durationMinutes: 20 },
                { title: 'HttpClient & RxJS Observables', orderIndex: 3, type: LessonType.VIDEO, durationMinutes: 25 },
                { title: 'Signal-based State Stores', orderIndex: 4, type: LessonType.VIDEO, durationMinutes: 15 },
                { title: 'Quiz: Services & DI', orderIndex: 5, type: LessonType.QUIZ, durationMinutes: 10 },
              ],
            },
          },
          {
            title: 'Module 6: Routing',
            orderIndex: 6,
            durationMinutes: 60,
            lessons: {
              create: [
                { title: 'Configuring Route Tables', orderIndex: 1, type: LessonType.VIDEO, durationMinutes: 15 },
                { title: 'Route Parameters and Query Params', orderIndex: 2, type: LessonType.VIDEO, durationMinutes: 15 },
                { title: 'Functional Guards & Auth Interceptors', orderIndex: 3, type: LessonType.VIDEO, durationMinutes: 15 },
                { title: 'Lazy Loading Feature Boundaries', orderIndex: 4, type: LessonType.VIDEO, durationMinutes: 15 },
              ],
            },
          },
        ],
      },
    },
    include: { modules: { include: { lessons: true } } },
  });

  // Course 2: Node.js APIs
  const nodeCourse = await prisma.course.upsert({
    where: { slug: 'nodejs-apis' },
    update: {},
    create: {
      title: 'Node.js APIs',
      slug: 'nodejs-apis',
      description: 'Build scalable backends, secure authentication, and production-grade REST & GraphQL APIs with Node.js and NestJS.',
      shortDescription: 'Build scalable backends with Express, NestJS, Prisma and Redis.',
      categoryId: webCat.id,
      organizationId: organization.id,
      trainerId: sarahTrainer.id,
      level: CourseLevel.INTERMEDIATE,
      badge: 'Popular',
      iconText: '⌁',
      colorScheme: 'navy',
      durationHours: 16,
      rating: 4.8,
      reviewsCount: 1200,
      enrolledCount: 2850,
      isFeatured: true,
      modules: {
        create: [
          {
            title: 'Module 1: REST Architecture and NestJS Setup',
            orderIndex: 1,
            durationMinutes: 60,
            lessons: {
              create: [
                { title: 'RESTful Principles & HTTP Verbs', orderIndex: 1, type: LessonType.VIDEO, durationMinutes: 20 },
                { title: 'NestJS Modules, Controllers, and Services', orderIndex: 2, type: LessonType.VIDEO, durationMinutes: 25 },
                { title: 'Prisma Schema Modeling & Migrations', orderIndex: 3, type: LessonType.VIDEO, durationMinutes: 15 },
              ],
            },
          },
        ],
      },
    },
  });

  // Course 3: AWS Cloud Essentials
  const awsCourse = await prisma.course.upsert({
    where: { slug: 'aws-cloud-essentials' },
    update: {},
    create: {
      title: 'AWS Cloud Essentials',
      slug: 'aws-cloud-essentials',
      description: 'Learn AWS from scratch: IAM, EC2, S3, RDS, ECS, Lambda, CloudFront and deployment best practices.',
      shortDescription: 'Learn AWS from scratch with real cloud deployments.',
      categoryId: cloudCat.id,
      organizationId: organization.id,
      level: CourseLevel.BEGINNER,
      badge: 'Cloud',
      iconText: '☁',
      colorScheme: 'blue',
      durationHours: 14,
      rating: 4.7,
      reviewsCount: 856,
      enrolledCount: 1980,
      isFeatured: true,
      modules: {
        create: [
          {
            title: 'Module 1: Cloud Fundamentals & Core Services',
            orderIndex: 1,
            durationMinutes: 45,
            lessons: {
              create: [
                { title: 'Cloud Models: IaaS, PaaS, SaaS', orderIndex: 1, type: LessonType.VIDEO, durationMinutes: 15 },
                { title: 'IAM Policies, Roles and Security', orderIndex: 2, type: LessonType.VIDEO, durationMinutes: 15 },
                { title: 'S3 Buckets and CloudFront Distribution', orderIndex: 3, type: LessonType.VIDEO, durationMinutes: 15 },
              ],
            },
          },
        ],
      },
    },
  });

  // Course 4: UI/UX Design
  await prisma.course.upsert({
    where: { slug: 'ui-ux-design' },
    update: {},
    create: {
      title: 'UI/UX Design',
      slug: 'ui-ux-design',
      description: 'Design modern interfaces, wireframes, and production-ready design systems using Figma and user research.',
      shortDescription: 'Design modern interfaces with Figma and design systems.',
      categoryId: designCat.id,
      organizationId: organization.id,
      level: CourseLevel.INTERMEDIATE,
      badge: 'Design',
      iconText: '⌘',
      colorScheme: 'gold',
      durationHours: 10,
      rating: 4.6,
      reviewsCount: 642,
      enrolledCount: 1430,
      isFeatured: true,
    },
  });

  // Extra completed courses for Alex (to match 5 Enrolled, 3 In Progress, 2 Completed)
  const webFundCourse = await prisma.course.upsert({
    where: { slug: 'web-development-fundamentals' },
    update: {},
    create: {
      title: 'Web Development Fundamentals',
      slug: 'web-development-fundamentals',
      description: 'HTML5, CSS3 modern flexbox/grid and modern JavaScript ES6+ foundation.',
      categoryId: webCat.id,
      organizationId: organization.id,
      level: CourseLevel.BEGINNER,
      rating: 4.9,
      reviewsCount: 2100,
    },
  });

  const gitCourse = await prisma.course.upsert({
    where: { slug: 'git-github-mastery' },
    update: {},
    create: {
      title: 'Git & GitHub Mastery',
      slug: 'git-github-mastery',
      description: 'Master branch strategies, rebase, merges, pull request reviews and CI workflows.',
      categoryId: webCat.id,
      organizationId: organization.id,
      level: CourseLevel.BEGINNER,
      rating: 4.9,
      reviewsCount: 1800,
    },
  });

  // 7. Student Enrollments for Alex Johnson
  // Angular for Beginners: 60% progress (matches design!)
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: alexUser.id, courseId: angularCourse.id } },
    update: { progressPercent: 60, currentLessonTitle: 'Module 3: Components and Data Binding' },
    create: {
      userId: alexUser.id,
      courseId: angularCourse.id,
      status: EnrollmentStatus.ACTIVE,
      progressPercent: 60,
      currentLessonTitle: 'Module 3: Components and Data Binding',
    },
  });

  // Node.js APIs (In Progress)
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: alexUser.id, courseId: nodeCourse.id } },
    update: { progressPercent: 35 },
    create: {
      userId: alexUser.id,
      courseId: nodeCourse.id,
      status: EnrollmentStatus.ACTIVE,
      progressPercent: 35,
      currentLessonTitle: 'Module 1: REST Architecture',
    },
  });

  // AWS Cloud Essentials (In Progress)
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: alexUser.id, courseId: awsCourse.id } },
    update: { progressPercent: 20 },
    create: {
      userId: alexUser.id,
      courseId: awsCourse.id,
      status: EnrollmentStatus.ACTIVE,
      progressPercent: 20,
      currentLessonTitle: 'Module 1: IAM Policies',
    },
  });

  // Completed Course 1 (Web Dev Fundamentals)
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: alexUser.id, courseId: webFundCourse.id } },
    update: { progressPercent: 100, status: EnrollmentStatus.COMPLETED },
    create: {
      userId: alexUser.id,
      courseId: webFundCourse.id,
      status: EnrollmentStatus.COMPLETED,
      progressPercent: 100,
      completedAt: new Date(Date.now() - 30 * 86400000),
    },
  });

  // Completed Course 2 (Git & GitHub Mastery)
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: alexUser.id, courseId: gitCourse.id } },
    update: { progressPercent: 100, status: EnrollmentStatus.COMPLETED },
    create: {
      userId: alexUser.id,
      courseId: gitCourse.id,
      status: EnrollmentStatus.COMPLETED,
      progressPercent: 100,
      completedAt: new Date(Date.now() - 15 * 86400000),
    },
  });

  // 8. Certificates (matches Screen 11)
  await prisma.certificate.upsert({
    where: { certificateNumber: 'CERT-WEB-2025-091' },
    update: {},
    create: {
      userId: alexUser.id,
      courseId: webFundCourse.id,
      certificateNumber: 'CERT-WEB-2025-091',
      title: 'Angular for Beginners',
      issuedAt: new Date('2025-03-20'),
      grade: 'A+',
    },
  });

  await prisma.certificate.upsert({
    where: { certificateNumber: 'CERT-NODE-2025-104' },
    update: {},
    create: {
      userId: alexUser.id,
      courseId: nodeCourse.id,
      certificateNumber: 'CERT-NODE-2025-104',
      title: 'Node.js APIs',
      issuedAt: new Date('2025-04-05'),
      grade: 'A',
    },
  });

  await prisma.certificate.upsert({
    where: { certificateNumber: 'CERT-AWS-2025-228' },
    update: {},
    create: {
      userId: alexUser.id,
      courseId: awsCourse.id,
      certificateNumber: 'CERT-AWS-2025-228',
      title: 'AWS Cloud Essentials',
      issuedAt: new Date('2025-04-10'),
      grade: 'A+',
    },
  });

  // 9. Notifications (matches Screen 8)
  const notifications = [
    { title: 'New Assignment', message: 'You have a new assignment in Angular', type: NotificationType.ASSIGNMENT, actionUrl: '/assignments' },
    { title: 'Course Update', message: 'New content added to Node.js course', type: NotificationType.COURSE_UPDATE, actionUrl: '/courses/nodejs-apis' },
    { title: 'Certificate Earned', message: 'Congratulations! You earned a certificate', type: NotificationType.CERTIFICATE, actionUrl: '/certificates' },
  ];

  for (const n of notifications) {
    await prisma.notification.create({
      data: {
        userId: alexUser.id,
        title: n.title,
        message: n.message,
        type: n.type,
        actionUrl: n.actionUrl,
        isRead: false,
      },
    });
  }

  // 10. Messages (matches Screen 9)
  await prisma.chatMessage.createMany({
    data: [
      { senderId: sarahTrainer.id, receiverId: alexUser.id, content: 'Hi Alex, great work on Module 3! Let me know if you have any questions on signal observables.' },
      { senderId: jamesStudent.id, receiverId: alexUser.id, content: 'Hey Alex! Did you finish the Node.js API assignment yet?' },
      { senderId: adminUser.id, receiverId: alexUser.id, content: 'Welcome to EduSphere Pro Academy! Your enrollment is active.' },
      { senderId: emilyStudent.id, receiverId: alexUser.id, content: 'See you in the upcoming live workshop on Wednesday!' },
    ],
  });

  // 11. Calendar Events (matches Screen 4 & 10)
  const eventList = [
    { title: 'Assignment 3 - Angular for Beginners', eventType: 'ASSIGNMENT', startDate: new Date('2025-04-10T14:00:00Z'), courseId: angularCourse.id, userId: alexUser.id },
    { title: 'Final Project - Node.js APIs', eventType: 'PROJECT_DUE', startDate: new Date('2025-04-15T18:00:00Z'), courseId: nodeCourse.id, userId: alexUser.id },
    { title: 'Live Class: Component Architecture', eventType: 'LIVE_CLASS', startDate: new Date('2025-04-16T10:00:00Z'), courseId: angularCourse.id, userId: alexUser.id },
    { title: 'Quiz 2 - AWS Cloud Essentials', eventType: 'QUIZ', startDate: new Date('2025-04-18T16:00:00Z'), courseId: awsCourse.id, userId: alexUser.id },
    { title: 'Project Due: Microservice Prototype', eventType: 'PROJECT_DUE', startDate: new Date('2025-04-24T23:59:00Z'), courseId: nodeCourse.id, userId: alexUser.id },
  ];

  for (const ev of eventList) {
    await prisma.calendarEvent.create({
      data: ev,
    });
  }

  console.log('Database seeded successfully with Sprint 2 & Sprint 3 test data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
