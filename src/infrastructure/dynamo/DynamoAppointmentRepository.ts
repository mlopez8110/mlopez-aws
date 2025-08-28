import AWS from 'aws-sdk';
import { IAppointmentRepository } from '../../domain/IAppointmentRepository';
import { Appointment } from '../../domain/Appointment';

export class DynamoAppointmentRepository implements IAppointmentRepository {
  private client: AWS.DynamoDB.DocumentClient;
  private tableName: string;

  constructor(tableName: string) {
    this.client = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION });
    this.tableName = tableName;
  }

  async save(appointment: Appointment): Promise<void> {
    await this.client.put({
      TableName: this.tableName,
      Item: appointment
    }).promise();
  }

  async findByInsuredId(insuredId: string): Promise<Appointment[]> {
    const res = await this.client.query({
      TableName: this.tableName,
      IndexName: 'insuredId-index',
      KeyConditionExpression: 'insuredId = :i',
      ExpressionAttributeValues: {
        ':i': insuredId
      }
    }).promise();
    return (res.Items || []) as Appointment[];
  }

  async updateStatus(appointmentId: string, status: string): Promise<void> {
    await this.client.update({
      TableName: this.tableName,
      Key: { appointmentId },
      UpdateExpression: 'SET #s = :s',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':s': status }
    }).promise();
  }
}
