import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dentist, DentistDocument } from './schemas/dentist.schema';

@Injectable()
export class DentistService {
  constructor(
    @InjectModel(Dentist.name) private dentistModel: Model<DentistDocument>,
  ) {}

  create(data: Partial<Dentist>) {
    return this.dentistModel.create(data);
  }

  findByEmail(email: string) {
    return this.dentistModel.findOne({ email }).exec();
  }
}