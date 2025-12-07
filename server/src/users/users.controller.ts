import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { RolesGuard } from '../common/guards';
import { Roles } from '../common/decorators';
import { Role } from '@prisma/client';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('doctors')
  async getDoctors() {
    const doctors = await this.usersService.findDoctors();
    return doctors.map((doctor) => ({
      id: doctor.id,
      email: doctor.email,
      profile: doctor.doctorProfile,
    }));
  }

  @Get('patients')
  @Roles(Role.DOCTOR, Role.ADMIN)
  async getPatients() {
    const patients = await this.usersService.findPatients();
    return patients.map((patient) => ({
      id: patient.id,
      email: patient.email,
      profile: patient.patientProfile,
    }));
  }
}
