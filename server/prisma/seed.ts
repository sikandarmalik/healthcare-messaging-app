import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.patientProfile.deleteMany();
  await prisma.doctorProfile.deleteMany();
  await prisma.user.deleteMany();

  // Create password hash (password: "password123")
  const passwordHash = await bcrypt.hash('password123', 10);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@healthcare.com',
      passwordHash,
      role: Role.ADMIN,
    },
  });
  console.log(`Created admin: ${admin.email}`);

  // Create doctors
  const doctor1 = await prisma.user.create({
    data: {
      email: 'dr.smith@healthcare.com',
      passwordHash,
      role: Role.DOCTOR,
      doctorProfile: {
        create: {
          fullName: 'Dr. John Smith',
          specialty: 'General Medicine',
          hospitalName: 'City General Hospital',
          licenseNumber: 'MD-12345',
        },
      },
    },
  });
  console.log(`Created doctor: ${doctor1.email}`);

  const doctor2 = await prisma.user.create({
    data: {
      email: 'dr.johnson@healthcare.com',
      passwordHash,
      role: Role.DOCTOR,
      doctorProfile: {
        create: {
          fullName: 'Dr. Sarah Johnson',
          specialty: 'Cardiology',
          hospitalName: 'Heart Care Center',
          licenseNumber: 'MD-67890',
        },
      },
    },
  });
  console.log(`Created doctor: ${doctor2.email}`);

  // Create patients
  const patient1 = await prisma.user.create({
    data: {
      email: 'patient1@example.com',
      passwordHash,
      role: Role.PATIENT,
      patientProfile: {
        create: {
          fullName: 'Alice Brown',
          dateOfBirth: new Date('1985-03-15'),
          phone: '+1-555-0101',
          address: '123 Main St, City, ST 12345',
        },
      },
    },
  });
  console.log(`Created patient: ${patient1.email}`);

  const patient2 = await prisma.user.create({
    data: {
      email: 'patient2@example.com',
      passwordHash,
      role: Role.PATIENT,
      patientProfile: {
        create: {
          fullName: 'Bob Wilson',
          dateOfBirth: new Date('1990-07-22'),
          phone: '+1-555-0102',
          address: '456 Oak Ave, Town, ST 67890',
        },
      },
    },
  });
  console.log(`Created patient: ${patient2.email}`);

  // Create conversations
  const conversation1 = await prisma.conversation.create({
    data: {
      doctorId: doctor1.id,
      patientId: patient1.id,
    },
  });
  console.log(`Created conversation between ${doctor1.email} and ${patient1.email}`);

  // Create messages for conversation1
  await prisma.message.createMany({
    data: [
      {
        conversationId: conversation1.id,
        senderId: patient1.id,
        content: 'Hello Dr. Smith, I have been experiencing headaches lately.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        conversationId: conversation1.id,
        senderId: doctor1.id,
        content: 'Hello Alice, I\'m sorry to hear that. How often are you experiencing these headaches?',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        conversationId: conversation1.id,
        senderId: patient1.id,
        content: 'About 2-3 times a week, usually in the afternoon.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        conversationId: conversation1.id,
        senderId: doctor1.id,
        content: 'That could be tension headaches. Let\'s schedule an appointment to discuss this further and possibly run some tests.',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      },
    ],
  });
  console.log('Created messages for conversation1');

  // Create conversation2
  const conversation2 = await prisma.conversation.create({
    data: {
      doctorId: doctor2.id,
      patientId: patient1.id,
    },
  });
  console.log(`Created conversation between ${doctor2.email} and ${patient1.email}`);

  // Create messages for conversation2
  await prisma.message.createMany({
    data: [
      {
        conversationId: conversation2.id,
        senderId: patient1.id,
        content: 'Hi Dr. Johnson, my cardiologist referred me to you for a follow-up.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        conversationId: conversation2.id,
        senderId: doctor2.id,
        content: 'Welcome Alice! I received your referral. Let me review your records and we can discuss next steps.',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      },
    ],
  });
  console.log('Created messages for conversation2');

  console.log('Seeding completed successfully!');
  console.log('\n--- Sample Login Credentials ---');
  console.log('Admin: admin@healthcare.com / password123');
  console.log('Doctor 1: dr.smith@healthcare.com / password123');
  console.log('Doctor 2: dr.johnson@healthcare.com / password123');
  console.log('Patient 1: patient1@example.com / password123');
  console.log('Patient 2: patient2@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
