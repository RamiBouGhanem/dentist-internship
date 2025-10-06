import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
  Header,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { _id: string; name?: string };
}

@UseGuards(JwtAuthGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(
    @Body()
    body: {
      name: string;
      age?: number;
      gender?: string;
      dentistId?: string;
      dentitionType?: 'child' | 'mixed' | 'adult';
    },
  ) {
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

  /**
   * Add a PLANNED procedure (from the table) — DOES NOT draw on chart.
   */
  @Post(':id/teeth/:toothNumber/plan-procedure')
  @Header('Cache-Control', 'no-store')
  addPlannedProcedure(
    @Param('id') id: string,
    @Param('toothNumber') toothNumber: string,
    @Body()
    body: {
      type: string;
      color: string;
      notes?: string;
      dentistName?: string;
      plannedAt?: string;
    },
    @Req() req: AuthenticatedRequest,
  ) {
    const dentistId = req.user?._id;
    return this.patientsService.addPlannedProcedure(
      id,
      toothNumber,
      { ...body },
      dentistId,
    );
  }

  /**
   * Add an ACTUAL/COMPLETED overlay (from the chart).
   * Server will:
   * - flip a matching PLANNED row to completed, OR
   * - create a new completed row if no plan exists.
   */
  @Patch(':id/teeth/:toothNumber/add-procedure')
  @Header('Cache-Control', 'no-store')
  addProcedure(
    @Param('id') id: string,
    @Param('toothNumber') toothNumber: string,
    @Body() procedure: { type: string; color: string; x?: number; y?: number },
    @Req() req: AuthenticatedRequest,
  ) {
    const dentistId = req.user?._id;
    return this.patientsService.addProcedure(
      id,
      toothNumber,
      procedure,
      dentistId,
    );
  }

  @Delete(':id/teeth/:toothNumber/procedures/:index')
  @Header('Cache-Control', 'no-store')
  removeProcedure(
    @Param('id') id: string,
    @Param('toothNumber') toothNumber: string,
    @Param('index') index: number,
  ) {
    return this.patientsService.removeProcedure(id, toothNumber, index);
  }
}
