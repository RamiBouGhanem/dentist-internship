import { Controller, Get, Post, Param, Body, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { _id: string };
}

@UseGuards(JwtAuthGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) { }

  @Post()
  create(@Body() body: { name: string; age?: number; gender?: string; dentistId?: string }) {
    return this.patientsService.create(body);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    if (!req.user || !req.user._id) {
      throw new Error('Unauthorized: Dentist ID not found');
    }
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
