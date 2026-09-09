import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

const API = 'http://localhost:3000/api/v1';

export interface DashboardData {
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    avatarUrl?: string;
  };
  stats: {
    enrolledCourses: number;
    inProgress: number;
    completed: number;
    certificates: number;
  };
  continueLearning: {
    courseId: string;
    slug: string;
    title: string;
    currentModule: string;
    progressPercent: number;
    colorScheme?: string;
    iconText?: string;
  } | null;
  recommendedCourses: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    rating: number;
    reviewsCount: number;
    colorScheme: string;
    iconText: string;
  }>;
  progressCard: {
    overallProgress: number;
    inProgress: number;
    completed: number;
    notStarted: number;
  };
  upcomingDeadlines: Array<{
    id: string;
    title: string;
    eventType: string;
    courseTitle?: string;
    dueDate: string | Date;
  }>;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  certificateNumber: string;
  issuedAt: string;
  grade?: string;
  course?: {
    title: string;
    slug: string;
    level: string;
    durationHours: number;
  };
}

export interface ContactMessage {
  contact: {
    id: string;
    fullName: string;
    role: string;
    avatarUrl?: string;
  };
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export interface CalendarEventItem {
  id: string;
  title: string;
  eventType: string;
  startDate: string;
  endDate?: string;
  course?: { title: string; slug: string };
}

@Injectable({ providedIn: 'root' })
export class PortalDataService {
  private http = inject(HttpClient);

  // Fallback data matching design screenshot exactly
  private fallbackDashboard: DashboardData = {
    user: {
      id: 'alex-default',
      fullName: 'Alex Johnson',
      email: 'alex@example.com',
      role: 'STUDENT',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    },
    stats: {
      enrolledCourses: 5,
      inProgress: 3,
      completed: 2,
      certificates: 1,
    },
    continueLearning: {
      courseId: 'c-ang',
      slug: 'angular-for-beginners',
      title: 'Angular for Beginners',
      currentModule: 'Module 3: Components and Data Binding',
      progressPercent: 60,
      colorScheme: 'red',
      iconText: 'A',
    },
    recommendedCourses: [
      {
        id: 'c-node',
        title: 'Node.js APIs',
        slug: 'nodejs-apis',
        description: 'Build scalable backends…',
        rating: 4.8,
        reviewsCount: 1200,
        colorScheme: 'navy',
        iconText: '⌁',
      },
      {
        id: 'c-aws',
        title: 'AWS Cloud Essentials',
        slug: 'aws-cloud-essentials',
        description: 'Learn AWS from scratch',
        rating: 4.7,
        reviewsCount: 856,
        colorScheme: 'blue',
        iconText: '☁',
      },
      {
        id: 'c-ui',
        title: 'UI/UX Design',
        slug: 'ui-ux-design',
        description: 'Design modern interfaces',
        rating: 4.6,
        reviewsCount: 642,
        colorScheme: 'gold',
        iconText: '⌘',
      },
    ],
    progressCard: {
      overallProgress: 60,
      inProgress: 3,
      completed: 2,
      notStarted: 0,
    },
    upcomingDeadlines: [
      {
        id: 'd1',
        title: 'Assignment 3',
        courseTitle: 'Angular for Beginners',
        eventType: 'ASSIGNMENT',
        dueDate: 'Apr 10, 2025',
      },
      {
        id: 'd2',
        title: 'Final Project',
        courseTitle: 'Node.js APIs',
        eventType: 'PROJECT_DUE',
        dueDate: 'Apr 15, 2025',
      },
      {
        id: 'd3',
        title: 'Quiz 2',
        courseTitle: 'AWS Cloud Essentials',
        eventType: 'QUIZ',
        dueDate: 'Apr 18, 2025',
      },
    ],
  };

  private fallbackNotifications: { notifications: NotificationItem[]; unreadCount: number } = {
    unreadCount: 1,
    notifications: [
      {
        id: 'n1',
        title: 'New Assignment',
        message: 'You have a new assignment in Angular',
        type: 'ASSIGNMENT',
        isRead: false,
        createdAt: '2 hours ago',
      },
      {
        id: 'n2',
        title: 'Course Update',
        message: 'New content added to Node.js course',
        type: 'COURSE_UPDATE',
        isRead: true,
        createdAt: '1 day ago',
      },
      {
        id: 'n3',
        title: 'Certificate Earned',
        message: 'Congratulations! You earned a certificate',
        type: 'CERTIFICATE',
        isRead: true,
        createdAt: '3 days ago',
      },
    ],
  };

  private fallbackCertificates: CertificateItem[] = [
    {
      id: 'cert-1',
      title: 'Angular for Beginners',
      certificateNumber: 'CERT-ANG-2025-091',
      issuedAt: 'Mar 20, 2025',
      grade: 'A+',
      course: { title: 'Angular for Beginners', slug: 'angular-for-beginners', level: 'Beginner', durationHours: 13 },
    },
    {
      id: 'cert-2',
      title: 'Node.js APIs',
      certificateNumber: 'CERT-NODE-2025-104',
      issuedAt: 'Apr 5, 2025',
      grade: 'A',
      course: { title: 'Node.js APIs', slug: 'nodejs-apis', level: 'Intermediate', durationHours: 16 },
    },
    {
      id: 'cert-3',
      title: 'AWS Cloud Essentials',
      certificateNumber: 'CERT-AWS-2025-228',
      issuedAt: 'Apr 10, 2025',
      grade: 'A+',
      course: { title: 'AWS Cloud Essentials', slug: 'aws-cloud-essentials', level: 'Beginner', durationHours: 14 },
    },
  ];

  private fallbackContacts: ContactMessage[] = [
    {
      contact: {
        id: 'u-sarah',
        fullName: 'Sarah Wilson',
        role: 'Course Instructor',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
      },
      lastMessage: 'Hi Alex, great work on the components assignment! Let me know if you need help with signals.',
      timestamp: '2:30 PM',
      unread: true,
    },
    {
      contact: {
        id: 'u-james',
        fullName: 'James Carter',
        role: 'Student',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      },
      lastMessage: 'Are you joining the live class on Wednesday?',
      timestamp: 'Yesterday',
      unread: false,
    },
    {
      contact: {
        id: 'u-support',
        fullName: 'Support Team',
        role: 'EduSphere',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
      },
      lastMessage: 'Your Pro subscription benefits are active.',
      timestamp: 'Apr 5',
      unread: false,
    },
    {
      contact: {
        id: 'u-emily',
        fullName: 'Emily Davis',
        role: 'Student',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
      },
      lastMessage: 'Thanks for sharing your project notes!',
      timestamp: 'Apr 3',
      unread: false,
    },
  ];

  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${API}/portal/dashboard`).pipe(
      catchError(() => of(this.fallbackDashboard)),
    );
  }

  getNotifications(): Observable<{ notifications: NotificationItem[]; unreadCount: number }> {
    return this.http.get<{ notifications: NotificationItem[]; unreadCount: number }>(`${API}/portal/notifications`).pipe(
      catchError(() => of(this.fallbackNotifications)),
    );
  }

  markAllNotificationsRead(): Observable<any> {
    return this.http.post(`${API}/portal/notifications/read-all`, {}).pipe(
      catchError(() => of({ count: 1 })),
    );
  }

  getCertificates(): Observable<CertificateItem[]> {
    return this.http.get<CertificateItem[]>(`${API}/portal/certificates`).pipe(
      catchError(() => of(this.fallbackCertificates)),
    );
  }

  getMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(`${API}/portal/messages`).pipe(
      catchError(() => of(this.fallbackContacts)),
    );
  }

  updateProfile(data: any): Observable<any> {
    return this.http.patch(`${API}/portal/profile`, data).pipe(
      catchError(() => of({ ...data, updatedAt: new Date() })),
    );
  }

  // Course module APIs for Sprint 3
  getCourse(slug: string): Observable<any> {
    return this.http.get<any>(`${API}/courses/${slug}`).pipe(
      catchError(() => of(this.getFallbackCourse(slug))),
    );
  }

  getCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${API}/courses`).pipe(
      catchError(() =>
        of([
          {
            id: 'c1',
            title: 'Angular for Beginners',
            slug: 'angular-for-beginners',
            description: 'Learn Angular from scratch and build modern web applications with hands-on projects.',
            level: 'BEGINNER',
            rating: 4.8,
            reviewsCount: 1200,
            durationHours: 13,
            badge: 'Beginner',
            iconText: 'A',
            colorScheme: 'red',
          },
          {
            id: 'c2',
            title: 'Node.js APIs',
            slug: 'nodejs-apis',
            description: 'Build scalable backends and production-grade REST APIs using Node.js, Express, and Prisma.',
            level: 'INTERMEDIATE',
            rating: 4.8,
            reviewsCount: 1200,
            durationHours: 16,
            badge: 'Popular',
            iconText: '⌁',
            colorScheme: 'navy',
          },
          {
            id: 'c3',
            title: 'AWS Cloud Essentials',
            slug: 'aws-cloud-essentials',
            description: 'Learn AWS from scratch: IAM, EC2, S3, RDS, ECS, Lambda, CloudFront and deployment best practices.',
            level: 'BEGINNER',
            rating: 4.7,
            reviewsCount: 856,
            durationHours: 14,
            badge: 'Cloud',
            iconText: '☁',
            colorScheme: 'blue',
          },
          {
            id: 'c4',
            title: 'UI/UX Design',
            slug: 'ui-ux-design',
            description: 'Design modern interfaces, wireframes, and production-ready design systems using Figma.',
            level: 'INTERMEDIATE',
            rating: 4.6,
            reviewsCount: 642,
            durationHours: 10,
            badge: 'Design',
            iconText: '⌘',
            colorScheme: 'gold',
          },
        ]),
      ),
    );
  }

  // Organizations API for Sprint 2
  getOrganizations(): Observable<any[]> {
    return this.http.get<any[]>(`${API}/organizations`).pipe(
      catchError(() =>
        of([
          {
            id: 'org-1',
            name: 'EduSphere Global Academy',
            slug: 'edusphere-global',
            domain: 'edusphere.edu',
            country: 'Australia',
            subscription: { plan: 'PRO', status: 'ACTIVE', maxUsers: 1000, maxCourses: 200 },
            _count: { branches: 3, members: 142, courses: 24 },
          },
        ]),
      ),
    );
  }

  getOrganization(slugOrId: string): Observable<any> {
    return this.http.get<any>(`${API}/organizations/${slugOrId}`).pipe(
      catchError(() =>
        of({
          id: 'org-1',
          name: 'EduSphere Global Academy',
          slug: 'edusphere-global',
          domain: 'edusphere.edu',
          contactEmail: 'admin@edusphere.com',
          contactPhone: '+61 2 9876 5432',
          address: 'Level 14, 200 George Street, Sydney',
          country: 'Australia',
          subscription: { plan: 'PRO', status: 'ACTIVE', maxUsers: 1000, maxCourses: 200 },
          branches: [
            { id: 'b1', name: 'Sydney Central Campus', code: 'SYD-01', city: 'Sydney', country: 'Australia' },
            { id: 'b2', name: 'New York Campus', code: 'NYC-01', city: 'New York', country: 'USA' },
            { id: 'b3', name: 'Melbourne Tech Hub', code: 'MEL-02', city: 'Melbourne', country: 'Australia' },
          ],
          members: [
            { id: 'm1', role: 'ADMIN', user: { fullName: 'Elena Rostova', email: 'admin@edusphere.com', role: 'ADMIN' }, branch: { name: 'Sydney Central Campus' } },
            { id: 'm2', role: 'TRAINER', user: { fullName: 'Sarah Wilson', email: 'sarah.wilson@edusphere.com', role: 'TRAINER' }, branch: { name: 'Sydney Central Campus' } },
            { id: 'm3', role: 'STUDENT', user: { fullName: 'Alex Johnson', email: 'alex@example.com', role: 'STUDENT' }, branch: { name: 'New York Campus' } },
          ],
        }),
      ),
    );
  }

  private getFallbackCourse(slug: string) {
    return {
      id: 'c1',
      title: 'Angular for Beginners',
      slug: 'angular-for-beginners',
      description: 'Learn Angular from scratch and build modern web applications with hands-on projects.',
      level: 'Beginner',
      rating: 4.8,
      reviewsCount: 1200,
      durationHours: 13,
      badge: 'Beginner',
      iconText: 'A',
      colorScheme: 'red',
      lastUpdated: 'Mar 2025',
      modules: [
        {
          id: 'm1',
          title: 'Module 1: Introduction',
          duration: '3 lessons · 45 min',
          lessons: [
            { id: 'l1', title: '1.1 What is Angular & SPA Architecture', duration: '15 min', type: 'VIDEO' },
            { id: 'l2', title: '1.2 Installing Angular CLI & Tooling', duration: '15 min', type: 'VIDEO' },
            { id: 'l3', title: '1.3 Your First Angular Application', duration: '15 min', type: 'TEXT' },
          ],
        },
        {
          id: 'm2',
          title: 'Module 2: Setting up the Environment',
          duration: '4 lessons · 1h',
          lessons: [
            { id: 'l4', title: '2.1 Node.js and TypeScript Configurations', duration: '15 min', type: 'VIDEO' },
            { id: 'l5', title: '2.2 Workspace Directory Tour', duration: '15 min', type: 'VIDEO' },
            { id: 'l6', title: '2.3 Editor Setup & Extensions', duration: '15 min', type: 'TEXT' },
            { id: 'l7', title: '2.4 Serving and Debugging Code', duration: '15 min', type: 'VIDEO' },
          ],
        },
        {
          id: 'm3',
          title: 'Module 3: Components and Data Binding',
          duration: '5 lessons · 1h 30m',
          isExpanded: true,
          lessons: [
            { id: 'l8', title: '3.1 Understanding Components', duration: '15 min', type: 'VIDEO', completed: true },
            { id: 'l9', title: '3.2 Component Interaction', duration: '20 min', type: 'VIDEO', completed: true },
            { id: 'l10', title: '3.3 Data Binding', duration: '25 min', type: 'VIDEO', completed: true },
            { id: 'l11', title: '3.4 Event Handling', duration: '20 min', type: 'VIDEO', completed: false },
            { id: 'l12', title: '3.5 Quiz: Components', duration: '10 min', type: 'QUIZ', completed: false },
          ],
        },
        {
          id: 'm4',
          title: 'Module 4: Directives',
          duration: '4 lessons · 1h',
          lessons: [
            { id: 'l13', title: '4.1 Modern Built-in Control Flow (@if, @for)', duration: '15 min', type: 'VIDEO' },
            { id: 'l14', title: '4.2 Attribute Directives', duration: '15 min', type: 'VIDEO' },
            { id: 'l15', title: '4.3 Custom Structural Directives', duration: '15 min', type: 'VIDEO' },
            { id: 'l16', title: '4.4 Host Binding & Host Listeners', duration: '15 min', type: 'VIDEO' },
          ],
        },
        {
          id: 'm5',
          title: 'Module 5: Services and Dependency Injection',
          duration: '5 lessons · 1h 30m',
          lessons: [
            { id: 'l17', title: '5.1 Inversion of Control & Angular DI', duration: '20 min', type: 'VIDEO' },
            { id: 'l18', title: '5.2 Creating Singleton Services', duration: '20 min', type: 'VIDEO' },
            { id: 'l19', title: '5.3 HttpClient and Observables', duration: '25 min', type: 'VIDEO' },
            { id: 'l20', title: '5.4 Signal-based Reactive Stores', duration: '15 min', type: 'VIDEO' },
            { id: 'l21', title: '5.5 Quiz: Services & DI', duration: '10 min', type: 'QUIZ' },
          ],
        },
        {
          id: 'm6',
          title: 'Module 6: Routing',
          duration: '4 lessons · 1h',
          lessons: [
            { id: 'l22', title: '6.1 Defining Route Hierarchies', duration: '15 min', type: 'VIDEO' },
            { id: 'l23', title: '6.2 Route Parameters & Data Resolvers', duration: '15 min', type: 'VIDEO' },
            { id: 'l24', title: '6.3 Functional Auth Guards', duration: '15 min', type: 'VIDEO' },
            { id: 'l25', title: '6.4 Lazy Loading Modules', duration: '15 min', type: 'VIDEO' },
          ],
        },
      ],
    };
  }
}
