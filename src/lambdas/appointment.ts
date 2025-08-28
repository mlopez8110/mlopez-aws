import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { DynamoAppointmentRepository } from '../infrastructure/dynamo/DynamoAppointmentRepository';
import { SnsPublisher } from '../infrastructure/sns/SnsPublisher';
import { AppointmentService } from '../application/AppointmentService';
const tableName = process.env.APPOINTMENTS_TABLE || '';
const topicArn = process.env.SNS_TOPIC_ARN || '';
const repo = new DynamoAppointmentRepository(tableName);
const sns = new SnsPublisher(topicArn);
const service = new AppointmentService(repo, sns);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const method = event.httpMethod;
    console.log('Recepciob metodo:', method);
    if (method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      console.log('Request body:', body);
      const appointment = await service.createAppointment(body);
      console.log('Cita creada:', appointment);
      return {
        statusCode: 200,
        body: JSON.stringify({ appointmentId: appointment.appointmentId, status: appointment.status })
      };
    } else if (method === 'GET') {
      const insuredId = event.pathParameters?.insuredId;
      if (!insuredId) {
        return { statusCode: 400, body: 'insuredId requerido' };
      }
      const items = await service.listByInsured(insuredId);
      return { statusCode: 200, body: JSON.stringify(items) };
    } else {
      return { statusCode: 405, body: 'Metodo no permitido' };
    }
  } catch (err: any) {
    console.error('Error en crear citas', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message || 'Error' })
    };
  }
};