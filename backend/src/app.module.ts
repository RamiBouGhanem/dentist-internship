import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientsModule } from './patients/patients.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://ramiboughanem:HRxcFgT9Zmy7B9HS@dentist-medical-portal.cvvlnzi.mongodb.net/?retryWrites=true&w=majority&appName=dentist-medical-portal'),
    PatientsModule,
    AuthModule,
  ],
})
export class AppModule {}


// src/patients/patients.controller.ts
import { Controller, Get, Post, Param, Body, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { PatientsService } from './patients/patients.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(@Body() body: { name: string; age?: number; gender?: string; dentistId?: string }) {
    return this.patientsService.create(body);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.patientsService.findAll(req.user._id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.patientsService.update(id, updateData);
  }

  @Patch(':id/teeth/:toothNumber/add-procedure')
  addProcedure(
    @Param('id') id: string,
    @Param('toothNumber') toothNumber: string,
    @Body() procedure: { type: string; color: string; x?: number; y?: number },
  ) {
    return this.patientsService.addProcedure(id, toothNumber, procedure);
  }

  @Delete(':id/teeth/:toothNumber/procedures/:index')
  removeProcedure(
    @Param('id') id: string,
    @Param('toothNumber') toothNumber: string,
    @Param('index') index: number,
  ) {
    return this.patientsService.removeProcedure(id, toothNumber, index);
  }
}
