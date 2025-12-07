import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

interface CreatePatientData {
  email: string;
  passwordHash: string;
  fullName: string;
  dateOfBirth?: Date;
  phone?: string;
  address?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createPatient(data: CreatePatientData) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        role: Role.PATIENT,
        patientProfile: {
          create: {
            fullName: data.fullName,
            dateOfBirth: data.dateOfBirth,
            phone: data.phone,
            address: data.address,
          },
        },
      },
      include: {
        patientProfile: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        patientProfile: true,
        doctorProfile: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        patientProfile: true,
        doctorProfile: true,
      },
    });
  }

  async findDoctors() {
    return this.prisma.user.findMany({
      where: { role: Role.DOCTOR },
      include: {
        doctorProfile: true,
      },
    });
  }

  async findPatients() {
    return this.prisma.user.findMany({
      where: { role: Role.PATIENT },
      include: {
        patientProfile: true,
      },
    });
  }
}
