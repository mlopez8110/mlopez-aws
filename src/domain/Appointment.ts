export interface Appointment {
  appointmentId: string;
  insuredId: string;
  scheduleId: number;
  countryISO: string;
  status: string;
  createdAt: string;
  centerId?: number;
  specialtyId?: number;
  medicId?: number;
  date?: string;
}
