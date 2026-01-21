export class EventLog {
  private events: string[] = [];

  log(event: string): void {
    this.events.push(event);
  }

  get(): string[] {
    return this.events;
  }
}