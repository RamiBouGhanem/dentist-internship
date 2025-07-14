import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DentistService } from '../dentists/dentist.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private dentistService: DentistService,
    private jwtService: JwtService,
  ) {}

  async register(body: { name: string; email: string; password: string }) {
    const hashed = await bcrypt.hash(body.password, 10);
    const dentist = await this.dentistService.create({ ...body, password: hashed });
    const token = this.jwtService.sign({ sub: dentist._id });
    return { token, dentist };
  }

  async login(body: { email: string; password: string }) {
    const dentist = await this.dentistService.findByEmail(body.email);
    if (!dentist) return null;
    const match = await bcrypt.compare(body.password, dentist.password);
    if (!match) return null;
    const token = this.jwtService.sign({ sub: dentist._id });
    return { token, dentist };
  }
}
