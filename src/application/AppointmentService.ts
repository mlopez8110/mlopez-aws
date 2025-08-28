import { IAppointmentRepository } from '../domain/IAppointmentRepository';
import { Appointment } from '../domain/Appointment';
import { v4 as uuidv4 } from 'uuid';

export class AppointmentService {
  constructor(
    private repo: IAppointmentRepository,
    private publisher: { publish(message: any, countryISO: string): Promise<any> }
  ) {}

  async createAppointment(input: { insuredId: string; scheduleId: number; countryISO: string; centerId?: number; specialtyId?: number; medicId?: number; date?: string; }) {
    console.log('Creando citas:', input);

    if (!input.insuredId || input.insuredId.length !== 5) {
      throw new Error('insuredId debe tener 5 caracteres');
    }
    if (!['PE','CL'].includes(input.countryISO)) {
      throw new Error('countryISO inválido. Sólo "PE" o "CL"');
    }
    
    const appointment: Appointment = {
      appointmentId: uuidv4(),
      insuredId: input.insuredId,
      scheduleId: input.scheduleId,
      countryISO: input.countryISO,
      status: 'pending',
      createdAt: new Date().toISOString(),
      centerId: input.centerId,
      specialtyId: input.specialtyId,
      medicId: input.medicId,
      date: input.date
    };
    
    await this.repo.save(appointment);
    console.log('Grabar cita en DynamoDB:', appointment);

    await this.publisher.publish(appointment, input.countryISO);
    console.log('Publicar cita en SNS:', appointment);
    return appointment;
  }

  async listByInsured(insuredId: string) {
    return this.repo.findByInsuredId(insuredId);
  }
}
