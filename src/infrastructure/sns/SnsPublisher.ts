import AWS from 'aws-sdk';

export class SnsPublisher {
  private sns: AWS.SNS;
  private topicArn: string;

  constructor(topicArn: string) {
    //this.sns = new AWS.SNS({ region: process.env.AWS_REGION || 'us-east-1' });
    this.sns = new AWS.SNS({ region: process.env.AWS_REGION });
    this.topicArn = topicArn;
  }

  async publish(message: any, countryISO: string) {
    const params: AWS.SNS.PublishInput = {
      TopicArn: this.topicArn,
      Message: JSON.stringify(message),
      MessageAttributes: {
        countryISO: {
          DataType: 'String',
          StringValue: countryISO
        }
      }
    };
    return this.sns.publish(params).promise();
  }
}
