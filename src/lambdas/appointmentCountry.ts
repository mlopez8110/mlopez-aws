import { SQSEvent, SQSRecord } from 'aws-lambda';
import { DynamoAppointmentRepository } from '../infrastructure/dynamo/DynamoAppointmentRepository';
import { RdsAppointmentRepository } from '../infrastructure/rds/RdsAppointmentRepository';

const tableName = process.env.APPOINTMENTS_TABLE || '';
const repo = new DynamoAppointmentRepository(tableName);
const rdsRepo = new RdsAppointmentRepository();

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
    console.log('Evento SQS recbido:', JSON.stringify(event));

    for (const record of event.Records) {
        try {
            const detail = parseSqsRecord(record);
            console.log('Detalle registro SQS:', detail); 

            const message = JSON.parse(detail.Message);
            const appointmentId = message.appointmentId;

            if (appointmentId) {
                await repo.updateStatus(appointmentId, 'completed');
                console.log('Actualizacion de estado de cita por ID:', appointmentId); 

                // Grabar en RDS
                const appointmentData = {
                    appointmentId: appointmentId,
                    insuredId: message.insuredId,
                    scheduleId: message.scheduleId,
                    countryISO: message.countryISO,
                    centerId: message.centerId,
                    specialtyId: message.specialtyId,
                    medicId: message.medicId,
                    date: message.date,
                    createdAt: new Date().toISOString()
                };

                try {
                    await rdsRepo.saveToRDS(appointmentData);
                    console.log('Appointment saved to RDS:', appointmentData);
                } catch (error) {
                    console.error('Error saving appointment to RDS:', error);
                }
            } else {
                console.warn('No appointmentId found in confirmation event', detail);
            }
        } catch (err) {
            console.error('Error in appointmentConfirmation handler', err);
        }
    }
    return {};
};

