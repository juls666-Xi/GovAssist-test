import { PrismaClient, UserRole, ProgramStatus, ApplicationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.document.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.application.deleteMany();
  await prisma.assistanceProgram.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Cleared existing data");

  // Create Admin
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.create({
    data: {
      fullName: "System Administrator",
      email: "admin@govassist.gov",
      username: "admin",
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      phone: "+1 (555) 000-0001",
      address: "Government Building, Room 101",
    },
  });
  console.log("✅ Created admin user:", admin.email);

  // Create Staff
  const staffPassword = await bcrypt.hash("staff123", 12);
  const staff = await prisma.user.create({
    data: {
      fullName: "John Staff",
      email: "staff@govassist.gov",
      username: "staff",
      passwordHash: staffPassword,
      role: UserRole.STAFF,
      phone: "+1 (555) 000-0002",
      address: "Government Building, Room 205",
    },
  });
  console.log("✅ Created staff user:", staff.email);

  // Create Citizens
  const citizenPassword = await bcrypt.hash("citizen123", 12);
  const citizens = await Promise.all([
    prisma.user.create({
      data: {
        fullName: "Jane Citizen",
        email: "jane@example.com",
        username: "janecitizen",
        passwordHash: citizenPassword,
        role: UserRole.CITIZEN,
        phone: "+1 (555) 111-1111",
        address: "123 Main Street, Cityville",
      },
    }),
    prisma.user.create({
      data: {
        fullName: "Robert Smith",
        email: "robert@example.com",
        username: "robertsmith",
        passwordHash: citizenPassword,
        role: UserRole.CITIZEN,
        phone: "+1 (555) 222-2222",
        address: "456 Oak Avenue, Townsburg",
      },
    }),
    prisma.user.create({
      data: {
        fullName: "Maria Garcia",
        email: "maria@example.com",
        username: "mariagarcia",
        passwordHash: citizenPassword,
        role: UserRole.CITIZEN,
        phone: "+1 (555) 333-3333",
        address: "789 Pine Road, Villageton",
      },
    }),
  ]);
  console.log(`✅ Created ${citizens.length} citizen users`);

  // Create Assistance Programs
  const programs = await Promise.all([
    prisma.assistanceProgram.create({
      data: {
        title: "Housing Assistance Program",
        description: "Financial assistance for low-income families to secure safe and affordable housing. Covers rent subsidies, down payment assistance, and emergency housing support.",
        requirements: "- Must be a resident of the district for at least 6 months\n- Household income must be below 80% of area median income\n- Must provide proof of income (pay stubs, tax returns)\n- Must provide valid ID and proof of residency\n- Cannot own property in the district",
        budget: 500000.00,
        status: ProgramStatus.ACTIVE,
      },
    }),
    prisma.assistanceProgram.create({
      data: {
        title: "Food Security Initiative",
        description: "Monthly food vouchers and nutrition support for families facing food insecurity. Includes access to community food banks and nutrition education programs.",
        requirements: "- Must demonstrate financial need\n- Must provide proof of household size\n- Must attend nutrition education session\n- Must reapply every 6 months\n- Income must be below poverty line",
        budget: 250000.00,
        status: ProgramStatus.ACTIVE,
      },
    }),
    prisma.assistanceProgram.create({
      data: {
        title: "Healthcare Access Fund",
        description: "Covers medical expenses, prescription medications, and preventive care for uninsured and underinsured residents. Includes mental health services support.",
        requirements: "- Must be uninsured or underinsured\n- Must provide medical necessity documentation\n- Must be a resident for at least 1 year\n- Income must be below 200% of federal poverty level\n- Must provide medical records if applicable",
        budget: 750000.00,
        status: ProgramStatus.ACTIVE,
      },
    }),
    prisma.assistanceProgram.create({
      data: {
        title: "Education Support Grant",
        description: "Scholarships and educational materials for students from low-income families. Covers tuition, books, supplies, and transportation costs for K-12 and adult education.",
        requirements: "- Must be enrolled in accredited educational institution\n- Must maintain minimum 2.5 GPA\n- Must provide enrollment verification\n- Family income must be below qualifying threshold\n- Must submit essay explaining need",
        budget: 300000.00,
        status: ProgramStatus.ACTIVE,
      },
    }),
    prisma.assistanceProgram.create({
      data: {
        title: "Small Business Relief",
        description: "Grants and low-interest loans for small businesses affected by economic downturns. Includes business mentoring and financial planning assistance.",
        requirements: "- Business must be registered in the district\n- Must have fewer than 50 employees\n- Must demonstrate economic hardship\n- Must provide business plan and financial statements\n- Must commit to job retention",
        budget: 1000000.00,
        status: ProgramStatus.ACTIVE,
      },
    }),
  ]);
  console.log(`✅ Created ${programs.length} assistance programs`);

  // Create Sample Applications
  const applications = await Promise.all([
    prisma.application.create({
      data: {
        userId: citizens[0].id,
        programId: programs[0].id,
        status: ApplicationStatus.APPROVED,
        remarks: "Application approved. All documents verified.",
        submittedAt: new Date("2024-01-15"),
        reviewedAt: new Date("2024-01-20"),
        reviewedBy: staff.id,
      },
    }),
    prisma.application.create({
      data: {
        userId: citizens[0].id,
        programId: programs[1].id,
        status: ApplicationStatus.PENDING,
        submittedAt: new Date("2024-03-01"),
      },
    }),
    prisma.application.create({
      data: {
        userId: citizens[1].id,
        programId: programs[2].id,
        status: ApplicationStatus.REVIEWING,
        remarks: "Under review. Awaiting additional medical documentation.",
        submittedAt: new Date("2024-02-10"),
        reviewedAt: new Date("2024-02-15"),
        reviewedBy: staff.id,
      },
    }),
    prisma.application.create({
      data: {
        userId: citizens[2].id,
        programId: programs[3].id,
        status: ApplicationStatus.REJECTED,
        remarks: "Incomplete application. Missing enrollment verification.",
        submittedAt: new Date("2024-01-05"),
        reviewedAt: new Date("2024-01-10"),
        reviewedBy: staff.id,
      },
    }),
  ]);
  console.log(`✅ Created ${applications.length} sample applications`);

  // Create Notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: citizens[0].id,
        title: "Application Approved",
        message: "Your Housing Assistance Program application has been approved. Please check your schedule for claim instructions.",
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: citizens[1].id,
        title: "Document Verification Required",
        message: "Please upload additional medical documentation for your Healthcare Access Fund application.",
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: citizens[2].id,
        title: "Application Rejected",
        message: "Your Education Support Grant application was rejected due to missing enrollment verification.",
        isRead: true,
      },
    }),
  ]);
  console.log("✅ Created sample notifications");

  // Create Schedules
  await Promise.all([
    prisma.schedule.create({
      data: {
        applicationId: applications[0].id,
        date: new Date("2024-02-01"),
        time: "10:00 AM",
        location: "Government Building, Room 301",
        status: ScheduleStatus.COMPLETED,
      },
    }),
    prisma.schedule.create({
      data: {
        applicationId: applications[0].id,
        date: new Date("2024-04-15"),
        time: "2:00 PM",
        location: "Government Building, Room 301",
        status: ScheduleStatus.SCHEDULED,
      },
    }),
  ]);
  console.log("✅ Created sample schedules");

  // Create Audit Logs
  await Promise.all([
    prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "SEED_DATABASE",
        targetTable: "system",
        ipAddress: "127.0.0.1",
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: staff.id,
        action: "REVIEW_APPLICATION",
        targetTable: "applications",
        targetId: applications[0].id,
        ipAddress: "192.168.1.100",
      },
    }),
  ]);
  console.log("✅ Created sample audit logs");

  console.log("\n🎉 Database seed completed successfully!");
  console.log("\n📋 Login Credentials:");
  console.log("   Admin:    admin@govassist.gov / admin123");
  console.log("   Staff:    staff@govassist.gov / staff123");
  console.log("   Citizen:  jane@example.com / citizen123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });