import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DentistDocument = HydratedDocument<Dentist>;

@Schema()
export class Dentist {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const DentistSchema = SchemaFactory.createForClass(Dentist);

