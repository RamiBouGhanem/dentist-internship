import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import type { HydratedDocument } from 'mongoose';

export type PatientDocument = HydratedDocument<Patient>;

@Schema()
export class Patient {
  @Prop({ required: true })
  name: string;

  @Prop()
  age?: number;

  @Prop()
  gender?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Dentist', required: true })
  dentistId: string;

  @Prop({ type: Object, default: {} })
  teethData: Record<
    string,
    { type: string; color: string; x?: number; y?: number }[]
  >;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
