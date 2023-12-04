# Proof of concept for a local setup for producer and consumer Nest.js applications

## How-to
To start the broker setup locally, simply execute `docker compose up brokers`. This will take care of setting up a local
AWS with an EventBridge Event Bus and SQS queues configured.

To start the applications, navigate to either the `producer` or the `consumer` subfolders. The `producer` offers a POST
endpoint that can be used to mock outside events. On arrival of a request, the `producer` puts events in the EventBridge
Event Bus, which routes them to the queue. If running, the `consumer` will consume the message and log it to the console.