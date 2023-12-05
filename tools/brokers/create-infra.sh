#!/bin/bash

alias awslocal='aws --endpoint-url http://localhost:4566'

eventBusName="yara-eu-events-bus"
awslocal events create-event-bus --name $eventBusName

queueName="field-deleted-queue"
queueUrl=$(awslocal sqs create-queue --queue-name $queueName --output text --query 'QueueUrl')
queueArn=$(awslocal sqs get-queue-attributes --queue-url $queueUrl --attribute-names 'QueueArn' --output text --query 'Attributes.QueueArn')

ruleName="field-deleted-rule"
awslocal events put-rule --event-bus-name $eventBusName --name $ruleName --event-pattern file:///etc/localstack/init/ready.d/field-deleted-pattern.json
awslocal events put-targets --event-bus-name $eventBusName --rule $ruleName --targets "Id"="1","Arn"="$queueArn"



queueName="field-created-queue"
queueUrl=$(awslocal sqs create-queue --queue-name $queueName --output text --query 'QueueUrl')
queueArn=$(awslocal sqs get-queue-attributes --queue-url $queueUrl --attribute-names 'QueueArn' --output text --query 'Attributes.QueueArn')

ruleName="field-created-rule"
awslocal events put-rule --event-bus-name $eventBusName --name $ruleName --event-pattern file:///etc/localstack/init/ready.d/field-created-pattern.json
awslocal events put-targets --event-bus-name $eventBusName --rule $ruleName --targets "Id"="1","Arn"="$queueArn"


