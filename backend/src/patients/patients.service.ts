import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient, PatientDocument } from './schemas/patient.schema';

type StoredProc = {
  type: string;
  color: string;
  x?: number;
  y?: number;
  // Extended (we don't change schema, but we do store these keys)
  status?: 'planned' | 'completed';
  plannedAt?: Date | string;
  createdAt?: Date | string;
  notes?: string;
  dentistName?: string;
};

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

  /* ---------------- Normalizers for robust matching ---------------- */

  // Normalize procedure type to be more forgiving ("Crown (Zirconia)" ≈ "crown")
  private normType(s?: string): string {
    if (!s) return '';
    return s
      .toLowerCase()
      .replace(/\(.*?\)/g, '')
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  // Convert primary letters A–T to FDI 51–85; else just return string
  private letterToFdi(letter: string): string | null {
    const map: Record<string, string> = {
      a: '51',
      b: '52',
      c: '53',
      d: '54',
      e: '55',
      f: '61',
      g: '62',
      h: '63',
      i: '64',
      j: '65',
      k: '71',
      l: '72',
      m: '73',
      n: '74',
      o: '75',
      p: '81',
      q: '82',
      r: '83',
      s: '84',
      t: '85',
    };
    return map[letter.toLowerCase()] ?? null;
  }

  private normTooth(v?: string | number): string {
    if (v === undefined || v === null) return '';
    const s = String(v).trim();
    if (/^[A-Ta-t]$/.test(s)) {
      return this.letterToFdi(s) ?? s.toUpperCase();
    }
    return s;
  }

  /* ---------------- Table: add a PLANNED row ---------------- */

  async addPlannedProcedure(
    patientId: string,
    toothNumber: string,
    body: {
      type: string;
      color: string;
      notes?: string;
      dentistName?: string;
      plannedAt?: string;
    },
    _dentistId?: string,
  ) {
    const patient = await this.patientModel.findById(patientId);
    if (!patient) throw new NotFoundException('Patient not found');

    const key = this.normTooth(toothNumber);
    const list: StoredProc[] = (patient.teethData?.[key] ?? []).slice();

    list.push({
      type: body.type,
      color: body.color,
      notes: body.notes ?? '',
      dentistName: body.dentistName,
      status: 'planned',
      plannedAt: body.plannedAt ? new Date(body.plannedAt) : new Date(),
    });

    patient.teethData = { ...(patient.teethData || {}), [key]: list };
    patient.markModified('teethData');
    await patient.save();

    return this.patientModel.findById(patientId).exec();
  }

  /* ---------------- Chart: add an actual overlay (COMPLETED) ---------------- */

  async addProcedure(
    patientId: string,
    toothNumber: string,
    procedure: { type: string; color: string; x?: number; y?: number },
    _dentistId?: string,
  ) {
    const patient = await this.patientModel.findById(patientId);
    if (!patient) throw new NotFoundException('Patient not found');

    const key = this.normTooth(toothNumber);
    const list: StoredProc[] = (patient.teethData?.[key] ?? []).slice();

    const nType = this.normType(procedure?.type);

    // 1) Try to find a PLANNED row that matches (by normalized type)
    const plannedIdx = list.findIndex(
      (p) => (p.status ?? 'completed') === 'planned' && this.normType(p.type) === nType,
    );

    if (plannedIdx !== -1) {
      // Flip the planned row to completed (preserve its notes/dentistName)
      const planned = list[plannedIdx];
      list[plannedIdx] = {
        ...planned,
        status: 'completed',
        createdAt: new Date(),
        color: procedure.color ?? planned.color,
        x: procedure.x ?? planned.x,
        y: procedure.y ?? planned.y,
      };
    } else {
      // 2) No plan existed → create a completed row directly
      list.push({
        type: procedure.type,
        color: procedure.color,
        x: procedure.x,
        y: procedure.y,
        status: 'completed',
        createdAt: new Date(),
      });
    }

    patient.teethData = { ...(patient.teethData || {}), [key]: list };
    patient.markModified('teethData');
    await patient.save();

    // Return fresh patient (teeth + history combined)
    return this.patientModel.findById(patientId).exec();
  }

  /* ---------------- Remove overlay by index ---------------- */

  async removeProcedure(patientId: string, toothNumber: string, index: number) {
    const patient = await this.patientModel.findById(patientId);
    if (!patient) return null;

    const key = this.normTooth(toothNumber);
    const procedures: StoredProc[] = (patient.teethData?.[key] ?? []).slice();
    procedures.splice(index, 1);
    patient.teethData = { ...(patient.teethData || {}), [key]: procedures };

    patient.markModified('teethData');
    return patient.save();
  }
}
