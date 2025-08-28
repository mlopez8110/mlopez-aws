import { SQSEvent, SQSRecord } from 'aws-lambda';
import { DynamoAppointmentRepository } from '../infrastructure/dynamo/DynamoAppointmentRepository';

const tableName = process.env.APPOINTMENTS_TABLE || '';
const repo = new DynamoAppointmentRepository(tableName);

function parseSqsRecord(record: SQSRecord) {
  try {
    const body = JSON.parse(record.body || '{}');

    if (body.detail) {
      return body.detail;
    }

    return body;
  } catch (e) {
    return { raw: record.body };
  }
}

export const handler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    try {
      const detail = parseSqsRecord(record);
      const appointmentId = detail.appointmentId;
      if (appointmentId) {
        await repo.updateStatus(appointmentId, 'completed');
      } else {
        console.warn('No se encontró ningún ID de cita a confirmar', detail);
      }
    } catch (err) {
      console.error('Error en handler de confirmacion', err);
    }
  }
  return {};
};
