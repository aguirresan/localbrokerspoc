export class FieldEventsDto {
  detail: Record<string, unknown> & { event: string };
  detailType: 'field-events';
}
