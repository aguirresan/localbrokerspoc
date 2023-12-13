import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import { SQSClient } from '@aws-sdk/client-sqs';
import { fromIni } from '@aws-sdk/credential-providers';
import { ConsumerService } from './consumer.service';

@Module({
  imports: [
    SqsModule.registerAsync({
      imports: [],
      useFactory: async () => {
        const sqsClient = new SQSClient({
          endpoint: 'http://localhost:4566',
          region: 'us-east-1',
          credentials: fromIni({ profile: 'localstack' }),
        });

        return {
          consumers: [
            {
              name: 'field-created-queue',
              queueUrl:
                'https://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/field-created-queue',
              region: 'us-east-1',
              terminateGracefully: true,
              sqs: sqsClient,
            },
          ],
          producers: [],
        };
      },
      inject: [],
    }),
  ],
  controllers: [],
  providers: [ConsumerService],
  exports: [],
})
export class ConsumerModule {}
