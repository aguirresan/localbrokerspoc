export class FieldEventsDto {
  detail: Record<string, unknown> & { eventName: string };
  detailType: 'YaraEuEvent';
}
