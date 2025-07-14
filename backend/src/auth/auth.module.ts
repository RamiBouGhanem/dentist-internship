import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Dentist, DentistSchema } from '../dentists/schemas/dentist.schema';
import { JwtStrategy } from './jwt.strategy';
import { DentistService } from '../dentists/dentist.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Dentist.name, schema: DentistSchema }]),
    PassportModule,
    JwtModule.register({
      secret: 'secret-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, DentistService],
  controllers: [AuthController],
})
export class AuthModule {}

