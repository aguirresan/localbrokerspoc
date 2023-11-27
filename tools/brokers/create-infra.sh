#!/bin/bash

alias awslocal='aws --endpoint-url http://localhost:4566'

topicArn=$(awslocal sns create-topic --name field-deleted-topic --output text --query 'TopicArn')
queueUrl=$(awslocal sqs create-queue --queue-name field-deleted-queue --output text --query 'QueueUrl')
queueArn=$(awslocal sqs get-queue-attributes --queue-url $queueUrl --attribute-names 'QueueArn' --output text --query 'Attributes.QueueArn')
echo "topicArn: $topicArn"
echo "queueUrl: $queueUrl"

awslocal sns subscribe --topic-arn $topicArn --protocol sqs --notification-endpoint $queueArn