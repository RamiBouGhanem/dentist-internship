import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient, PatientDocument } from './schemas/patient.schema';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
  ) {}

  // Create a new patient
  create(data: Partial<Patient>) {
    return this.patientModel.create(data);
  }

  // Get all patients for a dentist
  findAll(dentistId: string) {
    return this.patientModel.find({ dentistId }).exec();
  }

  // Get a patient by ID
  findById(id: string) {
    return this.patientModel.findById(id).exec();
  }

  // Update a patient
  update(id: string, updateData: Partial<Patient>) {
    return this.patientModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  // Add a procedure to a tooth
  async addProcedure(patientId: string, toothNumber: string, procedure: any) {
    return this.patientModel
      .findByIdAndUpdate(
        patientId,
        { $push: { [`teethData.${toothNumber}`]: procedure } },
        { new: true },
      )
      .exec();
  }

  // Remove procedure from tooth by index
  async removeProcedure(patientId: string, toothNumber: string, index: number) {
    const patient = await this.patientModel.findById(patientId);
    if (!patient) return null;

    const procedures = patient.teethData?.[toothNumber] || [];
    procedures.splice(index, 1);
    patient.teethData[toothNumber] = procedures;

    // Inform Mongoose of the nested update
    patient.markModified('teethData');
    return patient.save();
  }
}
