import { Appointment } from './Appointment';

export interface IAppointmentRepository {
  save(appointment: Appointment): Promise<void>;
  findByInsuredId(insuredId: string): Promise<Appointment[]>;
  updateStatus(appointmentId: string, status: string): Promise<void>;
}
