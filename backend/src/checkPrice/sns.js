import SNS from 'aws-sdk/clients/sns';

const {SNS_ARN} = process.env;

export default function publish(message) {
  const sns = new SNS();

  const params = {
    TopicArn: SNS_ARN,
    Message: JSON.stringify(message || {})
  };

  return sns.publish(params).promise();
}
