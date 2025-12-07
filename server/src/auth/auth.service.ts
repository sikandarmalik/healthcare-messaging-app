import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload, AuthenticatedUser } from '../common/interfaces';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, fullName, dateOfBirth, phone, address } =
      registerDto;

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user as PATIENT by default
    const user = await this.usersService.createPatient({
      email,
      passwordHash,
      fullName,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      phone,
      address,
    });

    // Generate token
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.patientProfile,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Get profile based on role
    let profile = null;
    if (user.role === Role.DOCTOR) {
      profile = user.doctorProfile;
    } else if (user.role === Role.PATIENT) {
      profile = user.patientProfile;
    }

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile,
      },
    };
  }

  async getMe(user: AuthenticatedUser) {
    const fullUser = await this.usersService.findById(user.id);
    if (!fullUser) {
      throw new UnauthorizedException('User not found');
    }

    let profile = null;
    if (fullUser.role === Role.DOCTOR) {
      profile = fullUser.doctorProfile;
    } else if (fullUser.role === Role.PATIENT) {
      profile = fullUser.patientProfile;
    }

    return {
      id: fullUser.id,
      email: fullUser.email,
      role: fullUser.role,
      profile,
    };
  }

  validateToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      return null;
    }
  }
}
