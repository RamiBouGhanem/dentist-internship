export declare class AppModule {
}
import { PatientsService } from './patients/patients.service';
export declare class PatientsController {
    private readonly patientsService;
    constructor(patientsService: PatientsService);
    create(body: {
        name: string;
        age?: number;
        gender?: string;
        dentistId?: string;
    }): Promise<any>;
    findAll(req: any): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateData: any): Promise<any>;
    addProcedure(id: string, toothNumber: string, procedure: {
        type: string;
        color: string;
        x?: number;
        y?: number;
    }): Promise<any>;
    removeProcedure(id: string, toothNumber: string, index: number): Promise<any>;
}
